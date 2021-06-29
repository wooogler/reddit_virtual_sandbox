from collections import defaultdict
from datetime import datetime
import os

import pandas as pd
import numpy as np
import prawcore.exceptions
from django.utils import timezone

from modsandbox.ml import process_embedding
from modsandbox.models import Post


def is_sub(name: str):
    return name.startswith('t3')


author_dict = defaultdict(dict)


def create_posts(posts, user, place, use_author):
    now = timezone.now()
    for post in posts:
        is_sub_post = is_sub(post.name)
        author_name = post.author.name
        if is_sub_post:
            if post.author and post.selftext != '[removed]':
                if use_author:
                    if author_name in author_dict:
                        author_info = author_dict[author_name]
                    else:
                        try:
                            id = post.author.id
                            author_dict[author_name] = vars(post.author)
                            author_info = author_dict[author_name]
                        except prawcore.exceptions.NotFound:
                            continue
                Post.objects.create(user=user,
                                    post_id=post.id,
                                    author=author_name,
                                    title=post.title,
                                    body=post.selftext,
                                    created_utc=datetime.fromtimestamp(post.created_utc, tz=timezone.utc),
                                    source='Spam' if post.banned_by is not None else 'Report' if post.num_reports is not None else 'Subreddit',
                                    banned_by=post.banned_by if post.banned_by is not None else None,
                                    place=place,
                                    url=post.url if hasattr(post, 'url') else 'https://www.reddit.com' + post.permalink,
                                    post_type='Submission',
                                    post_karma=author_info["link_karma"] if use_author else 0,
                                    comment_karma=author_info["comment_karma"] if use_author else 0,
                                    account_created_utc=datetime.fromtimestamp(author_info["created_utc"],
                                                                               tz=timezone.utc) if use_author else None,
                                    reports=post.num_reports if post.num_reports is not None else None)
        else:
            if post.author:
                if use_author:
                    if author_name in author_dict:
                        author_info = author_dict[author_name]
                    else:
                        try:
                            id = post.author.id
                            author_dict[author_name] = vars(post.author)
                            author_info = author_dict[author_name]
                        except prawcore.exceptions.NotFound:
                            continue
                Post.objects.create(user=user,
                                    post_id=post.id,
                                    author=author_name,
                                    title='',
                                    body=post.body,
                                    created_utc=datetime.fromtimestamp(post.created_utc, tz=timezone.utc),
                                    source='Spam' if post.banned_by is not None else 'Report' if post.num_reports is not None else 'Subreddit',
                                    banned_by=post.banned_by if post.banned_by is not None else None,
                                    place=place,
                                    url=post.url if hasattr(post,
                                                            'url') else 'https://www.reddit.com' + post.permalink,
                                    post_type='Comment',
                                    post_karma=author_info["link_karma"] if use_author else 0,
                                    comment_karma=author_info["comment_karma"] if use_author else 0,
                                    account_created_utc=datetime.fromtimestamp(author_info["created_utc"],
                                                                               tz=timezone.utc) if use_author else None,
                                    reports=post.num_reports if post.num_reports is not None else None)

    posts = Post.objects.filter(created_at__gte=now)
    return posts


def get_filtered_posts(posts: Post.objects, config_id: [int], rule_id: [int]
                       , check_combination_id: [int], check_id: [int]):
    if config_id is not None:
        return posts.filter(matching_configs__id=config_id)
    elif rule_id is not None:
        return posts.filter(matching_rules__id=rule_id)
    elif check_combination_id is not None:
        return posts.filter(matching_check_combinations__id=check_combination_id)
    elif check_id is not None:
        return posts.filter(matching_checks__id=check_id)
    else:
        return posts.none()


def get_unfiltered_posts(posts: Post.objects, config_id: [int], rule_id: [int]
                         , check_combination_id: [int], check_id: [int]):
    if config_id is not None:
        return posts.exclude(matching_configs__id=config_id)
    elif rule_id is not None:
        return posts.exclude(matching_rules__id=rule_id)
    elif check_combination_id is not None:
        return posts.exclude(matching_check_combinations__id=check_combination_id)
    elif check_id is not None:
        return posts.exclude(matching_checks__id=check_id)
    else:
        return posts


def get_df_posts_vector(posts: Post.objects):
    return pd.DataFrame(data={
        "id": [str(post.id) for post in posts],
        "vector": [get_embedding_post(post) for post in posts]
    })


def get_embedding_post(post):
    return process_embedding(post.title + ' ' + post.body)


def get_average_vector(vector_list):
    return np.mean(vector_list, axis=0)
