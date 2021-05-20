import os

import praw


class RedditHandler:
    def __init__(self, reddit_token):
        self.reddit = praw.Reddit(
            client_id=os.environ.get("client_id"),
            client_secret=os.environ.get("client_secret"),
            refresh_token=reddit_token,
            user_agent=os.environ.get("user_agent"),
        )

    def get_mod_subreddits(self):
        return [subreddit.display_name for subreddit in self.reddit.user.contributor_subreddits()]
