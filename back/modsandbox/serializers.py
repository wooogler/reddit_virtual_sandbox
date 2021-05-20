from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer
from .models import Post, User


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta(UserDetailsSerializer.Meta):
        model = User
        fields = ('username', 'reddit_token')


class PostSerializer(serializers.ModelSerializer):
    matching_rules = serializers.SerializerMethodField()

    def get_matching_rules(self, obj):
        rules = obj.matching_rules.filter(user=self.context['request'].user)
        return [rule.pk for rule in rules]

    class Meta:
        model = Post
        fields = "__all__"
