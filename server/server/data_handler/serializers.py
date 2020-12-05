from rest_framework import serializers

from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['_id', 'author', 'body', 'created_utc', 'full_link', 'subreddit', 'title', '_type']
