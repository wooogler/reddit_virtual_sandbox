from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model

User = get_user_model()

class Log(models.Model):
    user = models.ForeignKey(User, related_name='logs', on_delete=models.CASCADE)
    LOG_TYPES = [
        ("AR", "Apply Rules"),
        ("CS", "Change Sort"),
        ("WF", "Word Frequency"),
        ("SM", "Similar Words"),
        ("FP", "Find FP & FN"),
        ("EE", "End Experiment"),
    ]
    log_type = models.CharField(max_length=300, choices=LOG_TYPES)
    log_content = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.log_type+'-'+self.log_content

class Rule(models.Model):
    """
    Rule Model
    """

    user = models.ForeignKey(User, related_name="rules", on_delete=models.CASCADE)
    rule_index = models.IntegerField(default=-1)
    content = models.TextField(default="")

    def __str__(self):
        return self.rule_index

class Profile(models.Model):
    """
    Profile Model to extend User Model
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=300, default="default_username")
    # used_posts = models.ManyToManyField(Post, blank=True)
    reddit_token = models.CharField(max_length=300, default="")


class Post(models.Model):
    """
    Post Model
    """
    _id = models.CharField(max_length=300)
    author = models.CharField(max_length=300, default='FakeUser')
    title = models.CharField(max_length=300)  # Note that comment doesn't have title.
    body = models.TextField(default='')
    created_utc = models.DateTimeField()
    full_link = models.URLField(default='https://www.reddit.com/1')
    subreddit = models.CharField(max_length=300, default='FakeSubreddit')
    domain = models.CharField(max_length=300, default='')
    url = models.CharField(max_length=500, null=True)
    matching_rules = models.ManyToManyField(Rule, blank=True)
    # for sort
    votes = models.IntegerField(default=0)  # ups - downs
    similarity = models.FloatField(default=0)
    # for spam_
    banned_by = models.CharField(max_length=300, null=True)
    banned_at_utc = models.DateTimeField(null=True)
    mod_reason_title = models.CharField(null=True, max_length=300)
    # for reports_
    user_reports = models.JSONField(null=True) # [['spam',2],['trolling',1]]
    mod_reports = models.JSONField(null=True) # [['spam','mod_1'],['spam','mod_2'],['Can someone take a look at this?','mod_3']]
    # for post DB 
    is_private = models.BooleanField(default=True)
    
    user = models.ForeignKey(User, related_name="posts", on_delete=models.CASCADE, null=True)

    TYPE_CHOICES = [
        ("submission", "submission"),
        ("comment", "comment"),
        ("spam_submission", "spam_submission"),
        ("spam_comment", "spam_comment"),
        ("reports_submission", "reports_submission"),
        ("reports_comment", "reports_comment"),
    ]
    _type = models.CharField(max_length=18, choices=TYPE_CHOICES)

    def __str__(self):
        return self.full_link


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, username=instance.username)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
