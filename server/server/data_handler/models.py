import datetime
from django.db import models
from django.utils import timezone

# Create your models here.


class Post(models.Model):
    _id = models.CharField(max_length=300, primary_key=True)
    author = models.CharField(max_length=300)
    body = models.TextField()
    created_utc = models.DateTimeField()
    full_link = models.URLField()
    subreddit = models.CharField(max_length=300)
    title = models.CharField(max_length=300)  # Note that comment doesn't have title.

    TYPE_CHOICES = [('submission', 'submission'), ('comment', 'comment')]
    _type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return self._type + self.full_link
