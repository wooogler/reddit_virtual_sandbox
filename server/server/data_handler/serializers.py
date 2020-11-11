from rest_framework import serializers

from .models import Submission, Comment

class SubmissionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Submission
        fields = ['content', 'pub_date']


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ['submission', 'content', 'votes']
