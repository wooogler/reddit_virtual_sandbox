import datetime
from django.db import models
from django.utils import timezone

# Create your models here.

class Submission(models.Model):
    _id = models.CharField(max_length=300, primary_key=True)
    author = models.CharField(max_length=300)
    body = models.TextField()
    created_utc = models.DateTimeField()
    full_link = models.URLField()
    subreddit = models.CharField(max_length=300)
    title = models.CharField(max_length=300)

    matching_rules = models.JSONField(null=True)  # List of (rule_id, line_id)

    def __str__(self):
        return self.title

class Comment(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    _id = models.CharField(max_length=300, primary_key=True)
    author = models.CharField(max_length=300)
    body = models.TextField()
    created_utc = models.DateTimeField()
    full_link = models.URLField()
    subreddit = models.CharField(max_length=300)

    matching_rules = models.JSONField(null=True)  # List of (rule_id, line_id)
    
    def __str__(self):
        return self.body[:100]
