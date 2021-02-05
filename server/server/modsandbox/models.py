from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model

User = get_user_model()


class Rule(models.Model):
    """
    Rule Model
    """

    user = models.ForeignKey(User, related_name="rules", on_delete=models.CASCADE)
    rule_index = models.IntegerField(default=-1)
    content = models.TextField(default="")

    def __str__(self):
        return self.rule_index


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
    matching_rules = models.ManyToManyField(Rule, blank=True)
    banned_by = models.CharField(max_length=300, null=True)
    banned_at_utc = models.DateTimeField(null=True)

    TYPE_CHOICES = [
        ("submission", "submission"),
        ("comment", "comment"),
        ("spam_submission", "spam_submission"),
        ("spam_comment", "spam_comment"),
    ]
    _type = models.CharField(max_length=15, choices=TYPE_CHOICES)

    def __str__(self):
        return self._type + self.full_link


class Profile(models.Model):
    """
    Profile Model to extend User Model
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=300, default="default_username")
    used_posts = models.ManyToManyField(Post, blank=True)
    reddit_token = models.CharField(max_length=300, default="")


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, username=instance.username)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()