from collections import defaultdict
from datetime import datetime

import prawcore.exceptions
from django.utils import timezone

from modsandbox.models import Post
import logging


def is_sub(name: str):
    return name.startswith('t3')


author_dict = defaultdict(dict)


def create_posts(posts, user, place, use_author):
    now = timezone.now()
    for post in posts:
        is_sub_post = is_sub(post.name)
        if is_sub_post:
            if post.author and post.selftext != '[removed]':
                author_name = post.author.name
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
                author_name = post.author.name
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
