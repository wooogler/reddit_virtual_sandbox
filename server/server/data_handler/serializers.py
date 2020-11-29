from rest_framework import serializers

from .models import Submission, Comment

class SubmissionSerializer(serializers.ModelSerializer):
    """Serializer for Submission Model."""
    class Meta:
        model = Submission
        fields = ['_id', 'author', 'body', 'created_utc', 'full_link', 'subreddit', 'title', 'matching_rules']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment Model."""
    class Meta:
        model = Comment
        fields = ['submission', '_id', 'author', 'body', 'created_utc', 'full_link', 'subreddit', 'matching_rules']
