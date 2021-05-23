from datetime import datetime, timezone

from modsandbox.models import Post


def is_sub(name: str):
    return name.startswith('t3')


def create_posts(posts, user, place):
    bulk_posts = []
    for post in posts:
        print(post.num_reports)
        bulk_posts.append(Post(
            user=user,
            post_id=post.id,
            author='None' if post.author is None else post.author.name,
            title=post.title if is_sub(post.name) else '',
            body=post.selftext if is_sub(post.name) else post.body,
            created_utc=datetime.fromtimestamp(post.created_utc, tz=timezone.utc),
            source='Spam' if post.banned_by is not None else 'Report' if post.num_reports is not None else 'Subreddit',
            place=place,
        ))

    Post.objects.bulk_create(bulk_posts)
