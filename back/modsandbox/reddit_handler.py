import os
from datetime import datetime

from django.contrib.auth.models import AnonymousUser
from django.utils import timezone
from itertools import chain

import praw
from psaw import PushshiftAPI
from dateutil import relativedelta


def is_sub(name: str):
    return name.startswith('t3')


def after_to_datetime(after):
    now = timezone.now()
    now_day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    after_dict = {
        '3months': now_day_start + relativedelta.relativedelta(months=-3),
        'month': now_day_start + relativedelta.relativedelta(months=-1),
        '2weeks': now_day_start + relativedelta.relativedelta(weeks=-2),
        'week': now_day_start + relativedelta.relativedelta(weeks=-1),
        '3days': now_day_start + relativedelta.relativedelta(days=-3)
    }
    return after_dict[after]


def after_to_timestamp(after):
    return int(after_to_datetime(after).timestamp())


class RedditHandler:
    def __init__(self, user):
        if not isinstance(user, AnonymousUser):
            self.reddit = praw.Reddit(
                client_id=os.environ.get("client_id"),
                client_secret=os.environ.get("client_secret"),
                refresh_token=user.reddit_token,
                user_agent=os.environ.get("user_agent"),
            )
        else:
            self.reddit = praw.Reddit(
                client_id=os.environ.get("client_id"),
                client_secret=os.environ.get("client_secret"),
                user_agent=os.environ.get("user_agent"),
            )
        self.user = user
        self.api = PushshiftAPI(self.reddit)
        self.mod_subreddits = []

    def get_mod_subreddits(self):
        self.mod_subreddits = [subreddit.display_name for subreddit in self.reddit.user.contributor_subreddits()]
        return self.mod_subreddits

    def get_post_with_id(self, full_name: str):
        post_id = full_name[3:]
        if full_name.startswith('t3_'):
            return self.reddit.submission(id=post_id)
        elif full_name.startswith('t1_'):
            return self.reddit.comment(id=post_id)

    def get_posts_from_pushshift(self, subreddit, after, type):
        if type == 'submissions':
            return self.api.search_submissions(after=after_to_timestamp(after),
                                               subreddit=subreddit)

        elif type == 'comments':
            return self.api.search_comments(after=after_to_timestamp(after),
                                            subreddit=subreddit)

    def get_spams_from_praw(self, subreddit, after, type):
        if subreddit in self.mod_subreddits:
            spams = self.reddit.subreddit(subreddit).mod.spam(limit=None, only=type)
            reports = self.reddit.subreddit(subreddit).mod.reports(limit=None, only=type)
            spams_after = [spam for spam in spams if spam.created_utc > after_to_timestamp(after)]
            reports_after = [report for report in reports if report.created_utc > after_to_timestamp(after)]
            print(spams_after, reports_after)

            return chain(spams_after, reports_after)

        return []
