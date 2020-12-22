import praw
import os
from datetime import datetime, timezone
import logging

from .models import Post

logger = logging.getLogger(__name__)

class PrawHandler():
  def __init__(self, reddit_token): 
    self.reddit = praw.Reddit(
      client_id=os.environ.get('client_id'),
      client_secret=os.environ.get('client_secret'),
      refresh_token=reddit_token,
      user_agent=os.environ.get('user_agent'),
    )
  
  def _get_spam_posts(self):
    spams = self.reddit.subreddit('all').mod.spam(limit=None)
    spams = list(map(self.project_spam, spams))
    return spams

  @staticmethod
  def project_spam(spam):
    if type(spam)=='submission' :
      return {
        'author': spam['author'],
        'body': spam['body'],
        'created_utc': datetime.fromtimestamp(spam['created_utc'], tz=timezone.utc),
        'full_link': 'https://www.reddit.com' + spam['permalink'],
        '_id': spam['id'],
        'subreddit': spam['subreddit'],
        'title': spam['title'],
        '_type': 'spam_submission',
        'banned_by': spam['banned_by'],
        'banned_at_utc': datetime.fromtimestamp(spam['banned_at_utc'], tz=timezone.utc)
      }

    return {
      'author': spam['author'],
      'body': spam['body'],
      'created_utc': datetime.fromtimestamp(spam['created_utc'], tz=timezone.utc),
      'full_link': 'https://www.reddit.com' + spam['permalink'],
      '_id': spam['id'],
      'subreddit': spam['subreddit'],
      'title': '',
      '_type': 'spam_comment',
      'banned_by': spam['banned_by'],
      'banned_at_utc': datetime.fromtimestamp(spam['banned_at_utc'], tz=timezone.utc)
    }

  def run(self, **kwargs):
    stat = {'tot': 0, 'submission': 0, 'comment': 0}
    profile = kwargs['profile']
    spams = self._get_spam_posts()
    for spam in spams:
      obj, created = Post.objects.get_or_create(**spam)
      if profile is not None:
        obj.profile_set.add(profile)
      if created:
        stat['tot'] += 1
        stat[type(spam)] += 1

    logger.info(f'Number of newly inserted spams: {stat}')
    return True
