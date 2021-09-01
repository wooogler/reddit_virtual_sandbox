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
    task = models.CharField(max_length=50, null=True)

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


class Line(models.Model):
    rule = models.ForeignKey(Rule, related_name='lines', on_delete=models.CASCADE)
    # checks = models.ForeignKey(Check, related_name='lines', on_delete=models.CASCADE)
    code = models.TextField(default='')
    reverse = models.BooleanField(default='False')


class Check(models.Model):
    """
    Check Model
    """
    rule = models.ForeignKey(Rule, related_name='checks', on_delete=models.CASCADE)
    fields = models.CharField(max_length=50)
    word = models.TextField()
    line = models.ForeignKey(Line, related_name='checks', on_delete=models.CASCADE)
    code = models.TextField(default='')
    field = models.CharField(max_length=50)


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
    updated_at = models.DateTimeField(auto_now=True)
    url = models.TextField(default='')
    banned_by = models.CharField(max_length=300, null=True)
    post_karma = models.IntegerField(default=0)
    comment_karma = models.IntegerField(default=0)
    account_created_utc = models.DateTimeField(null=True)
    reports = models.IntegerField(null=True)
    score = models.IntegerField(default=0)
    rule_1 = models.IntegerField(default=0)
    rule_2 = models.IntegerField(default=0)
    task = models.CharField(max_length=50, null=True)

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
    matching_lines = models.ManyToManyField(Line, blank=True)

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


class Log(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name='logs', on_delete=models.CASCADE)
    task = models.CharField(max_length=50, null=True)
    info = models.CharField(max_length=50, null=True)
    content = models.TextField(null=True)
    move_to = models.CharField(max_length=20, null=True)
    post = models.ForeignKey(Post, related_name='logs', on_delete=models.CASCADE, null=True)
    config = models.ForeignKey(Config, related_name='logs', on_delete=models.CASCADE, null=True)
    rule = models.ForeignKey(Rule, related_name='logs', on_delete=models.CASCADE, null=True)
    line = models.ForeignKey(Line, related_name='logs', on_delete=models.CASCADE, null=True)
    _check = models.ForeignKey(Check, related_name='logs', on_delete=models.CASCADE, null=True)
    condition = models.CharField(max_length=20, null=True)
    test_tp = models.IntegerField(null=True)
    test_fn = models.IntegerField(null=True)
    test_fp = models.IntegerField(null=True)
    test_tn = models.IntegerField(null=True)
    eval_tp = models.IntegerField(null=True)
    eval_fn = models.IntegerField(null=True)
    eval_fp = models.IntegerField(null=True)
    eval_tn = models.IntegerField(null=True)
    test_range = models.IntegerField(null=True)
    eval_range = models.IntegerField(null=True)


class Survey(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    task = models.CharField(max_length=50, null=True)
    condition = models.CharField(max_length=50, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    feature1_useful = models.IntegerField(null=True)
    feature1_essay = models.TextField(null=True)
    feature2_useful = models.IntegerField(null=True)
    feature2_essay = models.TextField(null=True)
    feature3_useful = models.IntegerField(null=True)
    feature3_essay = models.TextField(null=True)
    feature4_useful = models.IntegerField(null=True)
    feature4_essay = models.TextField(null=True)


class Demo(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    condition = models.CharField(max_length=50, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    will = models.IntegerField(null=True)
    process = models.TextField(null=True)
    feedback = models.TextField(null=True)
    reddit_mod = models.IntegerField(null=True)
    community_mod = models.IntegerField(null=True)
    programming = models.CharField(max_length=10, null=True)
    gender = models.CharField(max_length=10, null=True)
    age = models.CharField(max_length=10, null=True)
    degree = models.CharField(max_length=10, null=True)
