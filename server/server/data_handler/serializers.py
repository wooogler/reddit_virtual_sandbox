from rest_framework import serializers

from .models import Post, Profile, Rule


class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = ["user", "rule_index", "content"]


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for Post Model
    """
    matching_rules=serializers.SerializerMethodField()

    def get_matching_rules(self, obj):
        rules = obj.matching_rules.filter(user=self.context['request'].user)
        return [rule.pk for rule in rules]

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
        ]


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Profile Model
    """

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"
