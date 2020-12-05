import argparse
from datetime import datetime, timedelta, timezone
import itertools
import json
import logging
import math
import sys
import time

import numpy as np
import praw
import requests

from .models import Post

logger = logging.getLogger(__name__)

class RedditHandler():
    def __init__(self):
        self.endpoint = {
            'submission': 'https://api.pushshift.io/reddit/search/submission',
            'comment': 'https://api.pushshift.io/reddit/search/comment'
        }
        self.request_size = 500

    def _get_reddit_posts(self, uri, params, max_retries=5):
        """Send HTTP request to 'uri'
        
        Returns:
            list(dict): posts.
        """
        trials = 1
        while trials < max_retries:
            try:
                time.sleep(1)
                response = requests.get(uri, params=params)
                assert response.status_code == 200
                posts = json.loads(response.content)['data']  # json.loads(json string) => python dict.

                project_meta = self.project_submission if uri == self.endpoint['submission'] else self.project_comment
                posts = list(map(project_meta, posts))  # List of dicts, where each dict = info for each post.
                return posts
            except Exception as e:
                logger.error(e)
                time.sleep(1)
                trials += 1
        logger.error('Failed to retrieve posts.')
        return -1

    @staticmethod
    def project_submission(post):
        return {
            'author': post['author'],
            'body': post['selftext'],
            'created_utc': datetime.fromtimestamp(post['created_utc'], tz=timezone.utc),
            'full_link': post['full_link'],
            '_id': post['id'],
            'subreddit': post['subreddit'],
            'title': post['title'],
            '_type': 'submission'
        }
    
    @staticmethod
    def project_comment(post):
        return {
            'author': post['author'],
            'body': post['body'],
            'created_utc': datetime.fromtimestamp(post['created_utc'], tz=timezone.utc),
            'full_link': 'https://www.reddit.com' + post['permalink'],
            '_id': post['id'],
            'subreddit': post['subreddit'],
            # 'link_id': post['link_id'][3:]  # link_id always starts with 't3_'--> id of a submission that this comment is linked to.
            'title': '',
            '_type': 'comment'
        }

    def run(self, **kwargs):
        """Get posts (submissions, comments) from Reddit using pushshift 
        & save them into database.

        Returns:
            bool: True if succeed False otherwise.
        """
        stat = {'tot': 0, 'submission': 0, 'comment': 0}
        post_type = kwargs.get('post_type')
        max_size = kwargs['max_size']
        if not post_type:
            post_types = ['submission', 'comment']
        else:
            post_types = [post_type]
        params = {
            'subreddit': kwargs['subreddit'],
            'after': kwargs['start_ts'],
            'before': kwargs['end_ts'],
            'size': self.request_size
        }

        for post_type in post_types:
            logger.info(f'Crawl {post_type}')
            n = self.request_size
            params['after'] = kwargs['start_ts']

            while (n == self.request_size):
                logger.info(f'Querying starting from {datetime.fromtimestamp(params["after"], tz=timezone.utc)}')
                posts = self._get_reddit_posts(self.endpoint[post_type], params)
                if posts == -1:
                    return False

                logger.info(f'Retrieved {len(posts)} {post_type}s.')
                for post in posts:
                    obj, created = Post.objects.get_or_create(**post)
                    if created:
                        stat[post_type] += 1
                        stat['tot'] += 1
                        if stat['tot'] >= max_size:
                            logger.info(f'Number of newly inserted posts: {stat}')
                            return True

                # For the next loop.
                n = len(posts)
                params['after'] = int(datetime.timestamp(posts[-1]['created_utc'])) + 1  # Might skip some posts.
            logger.info(f'Last data + 1 sec is {datetime.fromtimestamp(params["after"], tz=timezone.utc)}')

        logger.info(f'Number of newly inserted posts: {stat}')
        return True
