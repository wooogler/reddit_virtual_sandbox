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

    def get_mod_subreddits(self):
        return [subreddit.display_name for subreddit in self.reddit.user.contributor_subreddits()]

    def get_post_with_id(self, full_name: str):
        post_id = full_name[3:]
        if full_name.startswith('t3_'):
            return self.reddit.submission(id=post_id)
        elif full_name.startswith('t1_'):
            return self.reddit.comment(id=post_id)

    def get_posts_from_pushshift(self, subreddit, after, type):
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
            return chain(submissions, comments)
        elif type == 'sub':
            return submissions
        elif type == 'com':
            return comments
