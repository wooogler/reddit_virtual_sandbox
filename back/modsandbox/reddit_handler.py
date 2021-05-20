import os
from datetime import datetime, timezone
from itertools import chain

import praw
from psaw import PushshiftAPI
from dateutil import relativedelta

from modsandbox.models import Post


class RedditHandler:
    def __init__(self, user):
        self.reddit = praw.Reddit(
            client_id=os.environ.get("client_id"),
            client_secret=os.environ.get("client_secret"),
            refresh_token=user.reddit_token,
            user_agent=os.environ.get("user_agent"),
        )
        self.user = user
        self.api = PushshiftAPI(self.reddit)

    @staticmethod
    def is_sub(name: str):
        return name.startswith('t3')

    def get_mod_subreddits(self):
        return [subreddit.display_name for subreddit in self.reddit.user.contributor_subreddits()]

    def crawl(self, subreddit, after, type):
        now = datetime.now()
        after_dict = {
            '3months': int((now + relativedelta.relativedelta(months=-3)).timestamp()),
            'month': int((now + relativedelta.relativedelta(months=-1)).timestamp()),
            '2weeks': int((now + relativedelta.relativedelta(weeks=-2)).timestamp()),
            'week': int((now + relativedelta.relativedelta(weeks=-1)).timestamp()),
            'day': int((now + relativedelta.relativedelta(weeks=-1)).timestamp()),
        }

        submissions = self.api.search_submissions(after=after_dict[after],
                                                  subreddit=subreddit,
                                                  filter=['id'])

        comments = self.api.search_comments(after=after_dict[after],
                                            subreddit=subreddit,
                                            filter=['id'])
        if type == 'all':
            posts = chain(submissions, comments)
        elif type == 'sub':
            posts = submissions
        elif type == 'com':
            posts = comments

        for post in posts:
            Post.objects.create(
                user=self.user,
                post_id=post.id,
                author='None' if post.author is None else post.author.name,
                title=post.title if self.is_sub(post.name) else '',
                body=post.selftext if self.is_sub(post.name) else post.body,
                created_utc=datetime.fromtimestamp(post.created_utc, tz=timezone.utc),
                source='Subreddit',
                place='normal',
            )
