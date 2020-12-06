from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model


class Post(models.Model):
    """
    Post Model
    """
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

User = get_user_model()

class Profile(models.Model):
    """
    Profile Model to extend User Model
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    used_posts = models.ManyToManyField(Post, blank=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Rule(models.Model):
    """
    Rule Model
    """
    rule_id = models.IntegerField
    line_id = models.IntegerField
    user = models.ForeignKey(User, related_name='rules', on_delete=models.CASCADE)
    post = models.ManyToManyField(Post, blank=True)

    def __str__(self):
        return str(self.rule_id)+'-'+str(self.line_id)