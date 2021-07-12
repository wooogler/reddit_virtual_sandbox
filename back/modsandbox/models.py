from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    reddit_token = models.CharField(max_length=100)


class Config(models.Model):
    """
    Config Model
    """
    user = models.ForeignKey(User, related_name='configs', on_delete=models.CASCADE)
    code = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


class Rule(models.Model):
    """
    Rule Model
    """
    config = models.ForeignKey(Config, related_name='rules', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='rules', on_delete=models.CASCADE)
    code = models.TextField(default='')

    def __str__(self):
        return self.code


class Check(models.Model):
    """
    Check Model
    """
    rule = models.ForeignKey(Rule, related_name='checks', on_delete=models.CASCADE)
    fields = models.CharField(max_length=50)
    word = models.TextField()
    line = models.IntegerField()
    code = models.TextField(default='')


class CheckCombination(models.Model):
    rule = models.ForeignKey(Rule, related_name='check_combinations', on_delete=models.CASCADE)
    checks = models.ManyToManyField(Check, blank=True)
    code = models.TextField(default='')


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
    banned_by = models.CharField(max_length=300, null=True)
    post_karma = models.IntegerField(default=0)
    comment_karma = models.IntegerField(default=0)
    account_created_utc = models.DateTimeField(null=True)
    reports = models.IntegerField(null=True)
    score = models.IntegerField(default=0)

    # # for FP, FN
    # sim_fp = models.FloatField(default=None, null=True)
    # sim_fn = models.FloatField(default=None, null=True)
    # for FP, FN
    sim = models.FloatField(default=0)

    TYPE_CHOICES = [('Submission', 'Submission'), ('Comment', 'Comment')]
    post_type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    SOURCE_CHOICES = [('Subreddit', 'Subreddit'), ('Spam', 'Spam'), ('Report', 'Report')]
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)

    PLACE_CHOICES = [('target', 'target'), ('except', 'except'), ('normal', 'normal'),
                     ('normal-target', 'normal-target'), ('normal-except', 'normal-except')]
    place = models.CharField(max_length=14, choices=PLACE_CHOICES)

    user = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    matching_configs = models.ManyToManyField(Config, blank=True)
    matching_rules = models.ManyToManyField(Rule, blank=True)
    matching_checks = models.ManyToManyField(Check, blank=True, through='Match')
    matching_not_checks = models.ManyToManyField(Check, blank=True, through='NotMatch', related_name='not_check')
    matching_check_combinations = models.ManyToManyField(CheckCombination, blank=True)

    def __str__(self):
        return self.post_id


class Match(models.Model):
    _check = models.ForeignKey(Check, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    field = models.CharField(max_length=50, null=True)
    start = models.IntegerField(null=True)
    end = models.IntegerField(null=True)


class NotMatch(models.Model):
    _check = models.ForeignKey(Check, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    field = models.CharField(max_length=50, null=True)
    start = models.IntegerField(null=True)
    end = models.IntegerField(null=True)
