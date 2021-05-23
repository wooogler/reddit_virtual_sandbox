from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    reddit_token = models.CharField(max_length=100)


class Rule(models.Model):
    """
    Rule Model
    """
    user = models.ForeignKey(User, related_name='rules', on_delete=models.CASCADE)
    code = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


class Post(models.Model):
    """
    Post Model
    """
    post_id = models.CharField(max_length=300)
    author = models.CharField(max_length=300, default='FakeUser')
    title = models.CharField(max_length=300)
    body = models.TextField(default='')
    created_utc = models.DateTimeField()

    # for FP, FN
    sim = models.FloatField(default=0)

    SOURCE_CHOICES = [('Subreddit', 'Subreddit'), ('Spam', 'Spam'), ('Report', 'Report')]
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)

    PLACE_CHOICES = [('target', 'target'), ('except', 'except'), ('normal', 'normal')]
    place = models.CharField(max_length=7, choices=PLACE_CHOICES)

    user = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    matching_rules = models.ManyToManyField(Rule, blank=True)

    def __str__(self):
        return self.post_id
