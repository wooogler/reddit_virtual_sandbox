import json
from rest_framework import serializers
from .models import Post, Profile


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Profile Model
    """

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for Post Model
    """

    matching_rules = serializers.SerializerMethodField()

    def get_matching_rules(self, obj):
        rules = obj.matching_rules.filter(user=self.context["request"].user)
        return [rule.pk for rule in rules]

    def create(self, validated_data):
        profile = Profile.objects.get(user=self.context["request"].user)
        profile.used_posts.create(**validated_data)
        return Post(**validated_data)

    class Meta:
        model = Post
        fields = [
            "_id",
            "author",
            "body",
            "created_utc",
            "full_link",
            "subreddit",
            "title",
            "_type",
            "matching_rules",
            "banned_at_utc",
            "banned_by",
            "mod_reason_title",
            "mod_reports",
            "user_reports",
            "ups",
            "downs",
            "domain",
            "url",
        ]
