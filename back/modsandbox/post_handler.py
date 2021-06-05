from datetime import datetime

from django.utils import timezone

from modsandbox.models import Post


def is_sub(name: str):
    return name.startswith('t3')


def create_posts(posts, user, place):
    now = timezone.now()
    for post in posts:
        is_sub_post = is_sub(post.name)
        if post.author:
            Post.objects.create(user=user,
                                post_id=post.id,
                                author=post.author.name,
                                title=post.title if is_sub_post else '',
                                body=post.selftext if is_sub_post else post.body,
                                created_utc=datetime.fromtimestamp(post.created_utc, tz=timezone.utc),
                                source='Spam' if post.banned_by is not None else 'Report' if post.num_reports is not None else 'Subreddit',
                                banned_by=post.banned_by if post.banned_by is not None else None,
                                place=place,
                                url=post.url if hasattr(post, 'url') else 'https://www.reddit.com' + post.permalink,
                                post_type='Submission' if is_sub_post else 'Comment')

    posts = Post.objects.filter(created_at__gte=now)
    return posts