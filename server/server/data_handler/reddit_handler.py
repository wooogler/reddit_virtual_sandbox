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

from django.db.models import Q

from .models import Submission, Comment

logger = logging.getLogger(__name__)

class RedditHandler():
    def __init__(self):
        self.submission_endpoint = 'https://api.pushshift.io/reddit/search/submission'
        self.comment_endpoint = 'https://api.pushshift.io/reddit/search/comment'
        self.request_size = 100

    def get_posts_from_reddit(self, uri, params, max_retries=5):
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

                meta_projection = self.project_submission if uri == self.submission_endpoint else self.project_comment
                posts = list(map(meta_projection, posts))  # List of dicts, where each dict = info for each post.
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
            'title': post['title']
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
            'link_id': post['link_id'][3:]  # link_id always starts with 't3_'--> id of a submission that this comment is linked to.
        }

    def get_and_save_posts(self, subreddit, start_ts, end_ts, post_type,
                           submission_table=None, comment_table=None):
        """Get posts (submissions, comments) from Reddit using pushshift 
        & save them into database.

        Returns:
            bool: True if succeed False otherwise.
        """
        save_cnt = {'submission': 0, 'comment': 0}

        endpoint = self.submission_endpoint if post_type == 'submission' else self.comment_endpoint
        n = self.request_size
        while (n == self.request_size):
            logger.info(f'Querying starting from {datetime.fromtimestamp(start_ts, tz=timezone.utc)}')

            # Get posts in subreddit for specified time range.
            params = {'subreddit': subreddit, 'after': start_ts, 'before': end_ts, 'size': self.request_size}
            posts = self.get_posts_from_reddit(endpoint, params)
            if posts == -1:
                return False
            n = len(posts)  # Used in while loop condition.
            logger.info(f'Retrieved {n} {post_type}s.')

            # Save to database.

            if post_type == 'submission':
                for post in posts:
                    obj, created = Submission.objects.get_or_create(**post)
                    if created:
                        save_cnt['submission'] += 1
            else:
                comment_id2submission_id = {post['_id']: post['link_id'] for post in posts}
                submission_id2object = dict()
                linked_submissions = Submission.objects.filter(pk__in=comment_id2submission_id.values())
                for submission in linked_submissions:
                    submission_id2object[submission._id] = submission
                missing_submission_ids = [_id for _id in comment_id2submission_id.values()
                                          if _id not in submission_id2object]
                if missing_submission_ids:
                    parents = self.get_posts_from_reddit(self.submission_endpoint, {'ids': missing_submission_ids})
                    for parent in parents:
                        data = Submission(**parent)
                        data.save()
                        save_cnt['submission'] += 1
                        submission_id2object[parent['_id']] = data

                for post in posts:
                    submission_id = comment_id2submission_id[post['_id']]
                    linked_submission = submission_id2object.get(submission_id, None)
                    if linked_submission:
                        # link_id is redundant as it is same with foreign key column (submission_id)
                        post.pop('link_id')
                        obj, created = Comment.objects.get_or_create(submission=linked_submission, **post)
                        if created:
                            save_cnt['comment'] += 1
                    else:
                        logger.warning('Couldn\'t save comment(%s) because we could not find the linked submission.'
                                        % post['full_link'])


            start_ts = int(datetime.timestamp(posts[-1]['created_utc'])) + 1  # Might skip some posts.
        logger.info(f'Last data + 1 sec is {datetime.fromtimestamp(start_ts, tz=timezone.utc)}')

        logger.info('Number of posts newly inserted into database: submissions(%d), comments(%d)'
                    % (save_cnt['submission'], save_cnt['comment']))
        return True
