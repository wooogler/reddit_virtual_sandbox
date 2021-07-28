from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer
from .models import Post, User, Rule, Check, CheckCombination, Match, Config, NotMatch, Log, Survey, Demo
from .rule_handler import create_config


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta(UserDetailsSerializer.Meta):
        model = User
        fields = ('username', 'reddit_token')


class MatchSerializer(serializers.ModelSerializer):
    rule_id = serializers.SerializerMethodField()
    check_combination_ids = serializers.SerializerMethodField()
    config_id = serializers.SerializerMethodField()

    def get_config_id(self, obj):
        return obj._check.rule.config.id

    def get_rule_id(self, obj):
        return obj._check.rule.id

    def get_check_combination_ids(self, obj):
        return obj._check.checkcombination_set.values_list('id', flat=True)

    class Meta:
        model = Match
        fields = ('id', 'field', 'start', 'end', '_check_id', 'rule_id', 'check_combination_ids', 'config_id')


class NotMatchSerializer(serializers.ModelSerializer):
    rule_id = serializers.SerializerMethodField()
    check_combination_ids = serializers.SerializerMethodField()
    config_id = serializers.SerializerMethodField()

    def get_config_id(self, obj):
        return obj._check.rule.config.id

    def get_rule_id(self, obj):
        return obj._check.rule.id

    def get_check_combination_ids(self, obj):
        return obj._check.checkcombination_set.values_list('id', flat=True)

    class Meta:
        model = NotMatch
        fields = ('id', 'field', 'start', 'end', '_check_id', 'rule_id', 'check_combination_ids', 'config_id')


class PostSerializer(serializers.ModelSerializer):
    matching_checks = MatchSerializer(source='match_set', many=True, read_only=True)
    matching_not_checks = NotMatchSerializer(source='notmatch_set', many=True, read_only=True)

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ('user',)


class CheckSerializer(serializers.ModelSerializer):
    subreddit_count = serializers.SerializerMethodField()
    spam_count = serializers.SerializerMethodField()
    target_count = serializers.SerializerMethodField()
    except_count = serializers.SerializerMethodField()

    # code = serializers.SerializerMethodField()

    def get_subreddit_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source='Subreddit', created_utc__range=(start_date, end_date)).count()

    def get_spam_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source__in=['Spam', 'Report'], created_utc__range=(start_date, end_date)).count()

    def get_target_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(place__in=['target', 'normal-target'],
                                   created_utc__range=(start_date, end_date)).count()

    def get_except_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(place__in=['except', 'normal-except'],
                                   created_utc__range=(start_date, end_date)).count()

    # def get_code(self, obj):
    #     return obj.fields + ': ' + "['" + obj.word + "']"

    class Meta:
        model = Check
        fields = [
            "id",
            'subreddit_count',
            'spam_count',
            'code',
            'line',
            'target_count',
            'except_count',
        ]


class CheckCombinationSerializer(serializers.ModelSerializer):
    subreddit_count = serializers.SerializerMethodField()
    spam_count = serializers.SerializerMethodField()
    target_count = serializers.SerializerMethodField()
    except_count = serializers.SerializerMethodField()
    # code = serializers.SerializerMethodField()
    checks = CheckSerializer(many=True, read_only=True)

    def get_subreddit_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source='Subreddit', created_utc__range=(start_date, end_date)).count()

    def get_spam_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source__in=['Spam', 'Report'], created_utc__range=(start_date, end_date)).count()

    def get_target_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(place__in=['target', 'normal-target'],
                                   created_utc__range=(start_date, end_date)).count()

    def get_except_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(place__in=['except', 'normal-except'],
                                   created_utc__range=(start_date, end_date)).count()

    # def get_code(self, obj):
    #     checks = obj.checks.all()
    #     codes = []
    #     for check in checks:
    #         codes.append(check.fields + ': ' + "[ '" + check.word + "' ]")
    #     return "\n".join(codes)

    class Meta:
        model = CheckCombination
        fields = [
            'id',
            'checks',
            'code',
            'subreddit_count',
            'spam_count',
            'target_count',
            'except_count',
        ]


class RuleSerializer(serializers.ModelSerializer):
    subreddit_count = serializers.SerializerMethodField()
    spam_count = serializers.SerializerMethodField()
    target_count = serializers.SerializerMethodField()
    except_count = serializers.SerializerMethodField()
    checks = CheckSerializer(many=True, read_only=True)
    check_combinations = CheckCombinationSerializer(many=True, read_only=True)

    def get_subreddit_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source='Subreddit', created_utc__range=(start_date, end_date)).count()

    def get_spam_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source=['Spam', 'Report'], created_utc__range=(start_date, end_date)).count()

    def get_target_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(place__in=['target', 'normal-target'],
                                   created_utc__range=(start_date, end_date)).count()

    def get_except_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(place__in=['except', 'normal-except'],
                                   created_utc__range=(start_date, end_date)).count()

    class Meta:
        model = Rule
        fields = [
            'id',
            'code',
            'checks',
            'check_combinations',
            'subreddit_count',
            'spam_count',
            'target_count',
            'except_count',
        ]


class ConfigSerializer(serializers.ModelSerializer):
    rules = RuleSerializer(many=True, read_only=True)
    subreddit_count = serializers.SerializerMethodField()
    spam_count = serializers.SerializerMethodField()
    target_count = serializers.SerializerMethodField()
    except_count = serializers.SerializerMethodField()

    def get_subreddit_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source='Subreddit', created_utc__range=(start_date, end_date)).count()

    def get_spam_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(source=['Spam', 'Report'], created_utc__range=(start_date, end_date)).count()

    def get_target_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(place__in=['target', 'normal-target'],
                                   created_utc__range=(start_date, end_date)).count()

    def get_except_count(self, obj):
        start_date = self.context['request'].query_params.get('start_date')
        end_date = self.context['request'].query_params.get('end_date')
        return obj.post_set.filter(place__in=['except', 'normal-except'],
                                   created_utc__range=(start_date, end_date)).count()

    class Meta:
        model = Config
        fields = [
            'id',
            'code',
            'created_at',
            'rules',
            'task',
            'subreddit_count',
            'spam_count',
            'target_count',
            'except_count',
        ]

    def create(self, validated_data):
        config = create_config(validated_data['code'], self.context['request'].user, validated_data['task'])
        return config


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'created_utc'
        ]


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = "__all__"


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = "__all__"
        read_only_fields = ('user',)

    def create(self, validated_data):
        return Survey.objects.create(user=self.context['request'].user, **validated_data)


class DemoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Demo
        fields = "__all__"
        read_only_fields = ('user',)

    def create(self, validated_data):
        return Demo.objects.create(user=self.context['request'].user, **validated_data)
