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


class Check(models.Model):
    """
    Check Model
    """
    rule = models.ForeignKey(Rule, related_name='checks', on_delete=models.CASCADE)
    fields = models.CharField(max_length=50)
    word = models.TextField()


class CheckCombination(models.Model):
    rule = models.ForeignKey(Rule, related_name='check_combinations', on_delete=models.CASCADE)
    checks = models.ManyToManyField(Check, blank=True)


class Post(models.Model):
    """
    Post Model
    """
    post_id = models.CharField(max_length=300)
    author = models.CharField(max_length=300, default='FakeUser')
    title = models.CharField(max_length=300)
    body = models.TextField(default='')
    created_utc = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    url = models.TextField(default='')

    # for FP, FN
    sim = models.FloatField(default=0)

    TYPE_CHOICES = [('Submission', 'Submission'), ('Comment', 'Comment')]
    post_type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    SOURCE_CHOICES = [('Subreddit', 'Subreddit'), ('Spam', 'Spam'), ('Report', 'Report')]
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)

    PLACE_CHOICES = [('target', 'target'), ('except', 'except'), ('normal', 'normal')]
    place = models.CharField(max_length=7, choices=PLACE_CHOICES)

    user = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    matching_rules = models.ManyToManyField(Rule, blank=True)
    matching_checks = models.ManyToManyField(Check, blank=True)
    matching_check_combinations = models.ManyToManyField(CheckCombination, blank=True)

    def __str__(self):
        return self.post_id
