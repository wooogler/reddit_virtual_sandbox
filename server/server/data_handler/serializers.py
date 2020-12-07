from rest_framework import serializers

from .models import Post, Profile

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for Post Model
    """
    class Meta:
        model = Post
        fields = ['_id', 'author', 'body', 'created_utc', 'full_link', 'subreddit', 'title', '_type']

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'