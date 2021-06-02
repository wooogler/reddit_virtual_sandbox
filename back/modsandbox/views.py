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
from modsandbox.models import Post, User, Rule
from modsandbox.paginations import PostPagination
from modsandbox.reddit_handler import RedditHandler
from modsandbox.rule_handler import apply_rule
from modsandbox.serializers import PostSerializer, RuleSerializer, StatSerializer

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

        return redirect('http://localhost:3000/')

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
            check_combination_id = self.request.query_params.get("check_combination_id")
            filtered = self.request.query_params.get("filtered")
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if filtered == 'true':
            if rule_id is not None:
                queryset = queryset.filter(matching_rules__id=rule_id)
            elif check_combination_id is not None:
                queryset = queryset.filter(matching_check_combinations__id=check_combination_id)
            elif check_id is not None:
                queryset = queryset.filter(matching_checks__id=check_id)
            else:
                queryset = queryset.none()
        else:
            if rule_id is not None:
                queryset = queryset.exclude(matching_rules__id=rule_id)
            elif check_combination_id is not None:
                queryset = queryset.exclude(matching_check_combinations__id=check_combination_id)
            elif check_id is not None:
                queryset = queryset.exclude(matching_checks__id=check_id)

        return queryset

    def create(self, request, *args, **kwargs):
        subreddit = request.data.get('subreddit')
        after = request.data.get('after')
        type = request.data.get('type')

        if subreddit == '':
            return Response(status=status.HTTP_400_BAD_REQUEST)

        r = RedditHandler(request.user)
        pushshift_posts = r.get_posts_from_pushshift(subreddit, after, type)
        posts = create_posts(pushshift_posts, request.user, "normal")
        r.get_mod_subreddits()
        praw_spams = r.get_spams_from_praw(subreddit, after)
        spams = create_posts(praw_spams, request.user, "normal")
        rules = Rule.objects.filter(user=request.user)
        for rule in rules:
            apply_rule(rule, posts, False)
            apply_rule(rule, spams, False)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        super().get_queryset().all().delete()
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
        r = RedditHandler(request.user)
        target_post = r.get_post_with_id(full_name)
        posts = create_posts([target_post], request.user, "target")
        rules = Rule.objects.filter(user=request.user)
        for rule in rules:
            apply_rule(rule, posts, False)
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
        r = RedditHandler(request.user)
        except_post = r.get_post_with_id(full_name)
        posts = create_posts([except_post], request.user, "except")
        rules = Rule.objects.filter(user=request.user)
        for rule in rules:
            apply_rule(rule, posts, False)
        return Response(status=status.HTTP_200_OK)


class RuleViewSet(viewsets.ModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        super().get_queryset().all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StatViewSet(PostViewSet):
    serializer_class = StatSerializer
    pagination_class = None

    @action(detail=False, methods=['get'])
    def setting(self, request):
        queryset = self.queryset.filter(user=request.user)
        submissions = queryset.exclude(title='')
        comments = queryset.filter(title='')
        try:
            recent_sub_utc = submissions.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_sub_utc = None
        try:
            recent_com_utc = comments.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_com_utc = None

        return Response({
            "sub_recent": recent_sub_utc,
            "com_recent": recent_com_utc,
            "sub_count": submissions.count(),
            "com_count": comments.count(),
        })
