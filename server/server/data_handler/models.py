import datetime
from django.db import models
from django.utils import timezone

# Create your models here.

class Submission(models.Model):
    objects = models.Manager() # [Django] class has no objects member error fix
    id = models.CharField(max_length=6, primary_key=True) # ex) jvwgmt
    title = models.TextField('submission title', default='')
    selftext = models.TextField('submission body', default='')
    content = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')
    
    def __str__(self):
        return self.content

    def was_published_recently(self):
        return timezone.now() - datetime.timedelta(days=1) <= self.pub_date <= timezone.now()

    was_published_recently.admin_order_field = 'pub_date'
    was_published_recently.boolean = True
    was_published_recently.short_description = 'Published recently?'

class Comment(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    content = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
    
    def __str__(self):
        return self.content
