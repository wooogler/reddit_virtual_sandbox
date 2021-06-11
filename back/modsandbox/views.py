import os
import logging

from django.shortcuts import redirect
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status, filters
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
import praw
from rest_framework.views import APIView

from modsandbox.filters import PostFilter
from modsandbox.post_handler import create_posts
from modsandbox.models import Post, User, Rule, Config
from modsandbox.paginations import PostPagination
from modsandbox.reddit_handler import RedditHandler
from modsandbox.rule_handler import apply_config
from modsandbox.serializers import PostSerializer, RuleSerializer, StatSerializer, ConfigSerializer
from modsandbox.stat_handler import after_to_time_interval

logger = logging.getLogger(__name__)


class RedditViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    authentication_classes = [TokenAuthentication]
    reddit = praw.Reddit(
        client_id=os.environ.get("client_id"),
        client_secret=os.environ.get("client_secret"),
        redirect_uri=os.environ.get("redirect_uri"),
        user_agent=os.environ.get("user_agent"),
    )

    @action(methods=['get'], detail=False)
    def login(self, request):
        return Response(
            self.reddit.auth.url(
                ["identity", "read", "mysubreddits", "modcontributors"],
                request.user.id,
                "permanent",
            )
        )

    @action(methods=['get'], detail=False)
    def auth(self, request):
        try:
            code = request.query_params.get('code')
            state = request.query_params.get('state')
            token = self.reddit.auth.authorize(code)
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(pk=state)
        user.reddit_token = token
        user.save()

        return redirect('http://modsandbox.s3-website.ap-northeast-2.amazonaws.com/')
        # return redirect('http://localhost:3000/')

    @action(methods=['get'], detail=False)
    def logout(self, request):
        request.user.reddit_token = ''
        request.user.save()

        return Response(status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def mod_subreddits(self, request):
        r = RedditHandler(request.user)
        return Response(r.get_mod_subreddits())


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place__startswith='normal')
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = PostFilter
    ordering_fields = ['created_utc', 'sim']
    ordering = ['created_utc']

    def get_queryset(self):
        queryset = self.queryset.filter(user=self.request.user)
        try:
            rule_id = self.request.query_params.get("rule_id")
            check_id = self.request.query_params.get("check_id")
            config_id = self.request.query_params.get("config_id")
            check_combination_id = self.request.query_params.get("check_combination_id")
            filtered = self.request.query_params.get("filtered")
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if filtered == 'true':
            if config_id is not None:
                queryset = queryset.filter(matching_configs__id=config_id)
            elif rule_id is not None:
                queryset = queryset.filter(matching_rules__id=rule_id)
            elif check_combination_id is not None:
                queryset = queryset.filter(matching_check_combinations__id=check_combination_id)
            elif check_id is not None:
                queryset = queryset.filter(matching_checks__id=check_id)
            else:
                queryset = queryset.none()

        else:
            if config_id is not None:
                queryset = queryset.exclude(matching_configs__id=config_id)
            elif rule_id is not None:
                queryset = queryset.exclude(matching_rules__id=rule_id)
            elif check_combination_id is not None:
                queryset = queryset.exclude(matching_check_combinations__id=check_combination_id)
            elif check_id is not None:
                queryset = queryset.exclude(matching_checks__id=check_id)

        return queryset

    def create(self, request, *args, **kwargs):
        subreddit = request.data.get('subreddit')
        after = request.data.get('after')
        where = request.data.get('where')
        type = request.data.get('type')
        use_author = request.data.get('use_author')

        if subreddit == '':
            return Response(status=status.HTTP_400_BAD_REQUEST)

        r = RedditHandler(request.user)

        if where == 'Subreddit':
            pushshift_posts = r.get_posts_from_pushshift(subreddit, after, type)
            posts = create_posts(pushshift_posts, request.user, "normal", use_author)

        elif where == 'Spam':
            r.get_mod_subreddits()
            praw_spams = r.get_spams_from_praw(subreddit, after, type)
            posts = create_posts(praw_spams, request.user, "normal", use_author)

        configs = Config.objects.filter(user=request.user)
        for config in configs:
            apply_config(config, posts, False)

        return Response(status=status.HTTP_200_OK)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        queryset = self.queryset.filter(user=self.request.user)
        queryset.all().delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class TargetViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place__in=['target', 'normal-target'])
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    ordering = ['created_utc']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        full_name = request.data.get('full_name')
        use_author = request.data.get('use_author')
        if full_name:
            r = RedditHandler(request.user)
            target_post = r.get_post_with_id(full_name)
            posts = create_posts([target_post], request.user, "target", use_author)
        else:
            post = Post(user=request.user)
            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid(raise_exception=True):
                new_post = serializer.save()
                posts = Post.objects.filter(id=new_post.id)
        configs = Config.objects.filter(user=request.user)
        print(configs)
        for config in configs:
            apply_config(config, posts, False)
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.place == 'target':
            self.perform_destroy(instance)
        elif instance.place == 'normal-target':
            instance.place = 'normal'
            instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExceptViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place__in=['except', 'normal-except'])
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    ordering = ['created_utc']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        full_name = request.data.get('full_name')
        use_author = request.data.get('use_author')
        if full_name:
            r = RedditHandler(request.user)
            except_post = r.get_post_with_id(full_name)
            posts = create_posts([except_post], request.user, "except", use_author)
        else:
            post = Post(user=request.user)
            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid(raise_exception=True):
                new_post = serializer.save()
                posts = Post.objects.filter(id=new_post.id)
        configs = Config.objects.filter(user=request.user)
        for config in configs:
            apply_config(config, posts, False)
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.place == 'except':
            self.perform_destroy(instance)
        elif instance.place == 'normal-except':
            instance.place = 'normal'
            instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ConfigViewSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.code = request.data.get('code')
        instance.rules.all().delete()
        instance.save()
        posts = Post.objects.filter(user=self.request.user)
        apply_config(instance, posts, True)
        serializer = self.get_serializer(instance)
        self.perform_update(serializer)

        return Response(serializer.data)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        super().get_queryset().all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StatViewSet(PostViewSet):
    serializer_class = StatSerializer
    pagination_class = None

    @action(detail=False, methods=['get'])
    def graph(self, request):
        after = self.request.query_params.get("after")
        post_type = self.request.query_params.get("post_type")
        source = self.request.query_params.get("source")
        queryset = self.get_queryset()
        if post_type:
            queryset = queryset.filter(post_type=post_type)
        if source:
            if source == 'Spam':
                queryset = queryset.filter(source__in=['Spam', 'Report'])
            else:
                queryset = queryset.filter(source=source)
        datetime_interval = after_to_time_interval(after, 30)
        data_array = []
        for interval in datetime_interval:
            y = queryset.filter(created_utc__range=interval).count()
            data_array.append({'x0': interval[0], 'x1': interval[1], 'y': y})
        return Response(data_array)

    @action(detail=False, methods=['get'])
    def setting(self, request):
        queryset = self.queryset.filter(user=request.user)
        live_submissions = queryset.filter(post_type='Submission', source='Subreddit')
        live_comments = queryset.filter(post_type='Comment', source='Subreddit')
        spam_submissions = queryset.filter(post_type='Submission', source__in=['Spam', 'Report'])
        spam_comments = queryset.filter(post_type='Comment', source__in=['Spam', 'Report'])
        try:
            recent_live_sub_utc = live_submissions.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_live_sub_utc = None
        try:
            recent_live_com_utc = live_comments.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_live_com_utc = None
        try:
            recent_spam_sub_utc = spam_submissions.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_spam_sub_utc = None
        try:
            recent_spam_com_utc = spam_comments.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_spam_com_utc = None

        return Response({
            "live_sub_recent": recent_live_sub_utc,
            "live_com_recent": recent_live_com_utc,
            "live_sub_count": live_submissions.count(),
            "live_com_count": live_comments.count(),
            "spam_sub_recent": recent_spam_sub_utc,
            "spam_com_recent": recent_spam_com_utc,
            "spam_sub_count": spam_submissions.count(),
            "spam_com_count": spam_comments.count(),
        })
