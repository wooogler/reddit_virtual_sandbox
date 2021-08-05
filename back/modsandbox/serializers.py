from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer
from .models import Post, User, Rule, Check, Match, Config, NotMatch, Log, Survey, Demo, Line


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta(UserDetailsSerializer.Meta):
        model = User
        fields = ('username', 'reddit_token')


class MatchSerializer(serializers.ModelSerializer):
    rule_id = serializers.SerializerMethodField()
    config_id = serializers.SerializerMethodField()
    line_id = serializers.SerializerMethodField()

    def get_config_id(self, obj):
        return obj._check.rule.config.id

    def get_rule_id(self, obj):
        return obj._check.rule.id

    def get_line_id(self, obj):
        return obj._check.line.id

    class Meta:
        model = Match
        fields = (
            'id', 'field', 'start', 'end', '_check_id', 'rule_id', 'line_id', 'config_id')


class NotMatchSerializer(serializers.ModelSerializer):
    rule_id = serializers.SerializerMethodField()
    config_id = serializers.SerializerMethodField()
    line_id = serializers.SerializerMethodField()

    def get_config_id(self, obj):
        return obj._check.rule.config.id

    def get_rule_id(self, obj):
        return obj._check.rule.id

    def get_line_id(self, obj):
        return obj._check.line.id

    class Meta:
        model = NotMatch
        fields = (
            'id', 'field', 'start', 'end', '_check_id', 'line_id', 'rule_id', 'config_id')


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


class LineSerializer(serializers.ModelSerializer):
    subreddit_count = serializers.SerializerMethodField()
    spam_count = serializers.SerializerMethodField()
    target_count = serializers.SerializerMethodField()
    except_count = serializers.SerializerMethodField()
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

    class Meta:
        model = Line
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
    lines = LineSerializer(many=True, read_only=True)

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
            'lines',
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
