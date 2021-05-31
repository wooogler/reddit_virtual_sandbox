from collections import defaultdict
from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer
from .models import Post, User, Rule, Check, CheckCombination
from .rule_handler import create_rule


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta(UserDetailsSerializer.Meta):
        model = User
        fields = ('username', 'reddit_token')


class PostSerializer(serializers.ModelSerializer):
    # matching_rules = serializers.SerializerMethodField()
    #
    # def get_matching_rules(self, obj):
    #     rules = obj.matching_rules.filter(user=self.context['request'].user)
    #     return [rule.pk for rule in rules]

    class Meta:
        model = Post
        fields = "__all__"


class CheckSerializer(serializers.ModelSerializer):
    subreddit_count = serializers.SerializerMethodField()
    spam_count = serializers.SerializerMethodField()
    code = serializers.SerializerMethodField()

    def get_subreddit_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source='Subreddit', created_utc__range=(start_date, end_date)).count()

    def get_spam_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source__in=['Spam', 'Report'], created_utc__range=(start_date, end_date)).count()

    def get_code(self, obj):
        return obj.fields + ': ' + "[ '" + obj.word + "' ]"

    class Meta:
        model = Check
        fields = [
            "id",
            "fields",
            "word",
            'subreddit_count',
            'spam_count',
            'code',
        ]


class CheckCombinationSerializer(serializers.ModelSerializer):
    subreddit_count = serializers.SerializerMethodField()
    spam_count = serializers.SerializerMethodField()
    code = serializers.SerializerMethodField()
    checks = CheckSerializer(many=True, read_only=True)

    def get_subreddit_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source='Subreddit', created_utc__range=(start_date, end_date)).count()

    def get_spam_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source__in=['Spam', 'Report'], created_utc__range=(start_date, end_date)).count()

    def get_code(self, obj):
        checks = obj.checks.all()
        code_checks = defaultdict(list)
        codes = []
        for check in checks:
            code_checks[check.fields].append(check.word)
        for key in code_checks:
            codes.append(key + ': [ ' + ', '.join([("'" + word + "'") for word in code_checks[key]]) + ' ]')
        return "\n".join(codes)

    class Meta:
        model = CheckCombination
        fields = [
            'id',
            'checks',
            'code',
            'subreddit_count',
            'spam_count',
        ]


class RuleSerializer(serializers.ModelSerializer):
    subreddit_count = serializers.SerializerMethodField()
    spam_count = serializers.SerializerMethodField()
    checks = CheckSerializer(many=True, read_only=True)
    check_combinations = CheckCombinationSerializer(many=True, read_only=True)

    def get_subreddit_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        print(obj)
        return obj.post_set.filter(source='Subreddit', created_utc__range=(start_date, end_date)).count()

    def get_spam_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source=['Spam', 'Report'], created_utc__range=(start_date, end_date)).count()

    class Meta:
        model = Rule
        fields = [
            'id',
            'code',
            'created_at',
            'checks',
            'check_combinations',
            'subreddit_count',
            'spam_count',
        ]

    def create(self, validated_data):
        rule = create_rule(validated_data['code'], self.context['request'].user)
        return rule


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'created_utc'
        ]
