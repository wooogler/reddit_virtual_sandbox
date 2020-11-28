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
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    author = models.CharField(max_length=300)
    body = models.TextField()
    created_utc = models.DateTimeField()
    full_link = models.URLField()
    _id = models.CharField(max_length=300, primary_key=True)
    subreddit = models.CharField(max_length=300)
    # link_id = models.CharField(max_length=300)  # 없애고자 함.
    
    def __str__(self):
        return self.body[:100]
