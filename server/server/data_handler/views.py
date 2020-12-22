import logging
import json
import praw
from datetime import datetime, timezone

from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post, Profile, User, Rule
from .reddit_handler import RedditHandler
from .rule_handler import RuleHandler
from .automod import Ruleset, RuleTarget
from .serializers import PostSerializer, ProfileSerializer, RuleSerializer
from .pagintations import PostPagination


logger = logging.getLogger(__name__)


class RuleHandlerViewSet(viewsets.ModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer


class PostHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=self.request.user.id)
            queryset = queryset.filter(_id__in=profile.used_posts.all())
        post_type = self.request.query_params.get("post_type", "all")
        sort = self.request.query_params.get("sort", "new")
        filtered = self.request.query_params.get("filtered", "all")

        if post_type == "all":
            queryset = queryset.all()
        else:
            queryset = queryset.filter(_type=post_type)

        if sort == "new":
            queryset = queryset.order_by("-created_utc")
        elif sort == "old":
            queryset = queryset.order_by("created_utc")

        if filtered == "all":
            queryset = queryset.all()
        elif filtered == "filtered":
            queryset = queryset.filter(matching_rules__in=profile.user.rules.all())
        elif filtered == "unfiltered":
            queryset = queryset.exclude(matching_rules__in=profile.user.rules.all())

        return queryset

    @action(methods=["post"], detail=False, name="Bring Reddit Posts")
    def bring(self, request):
        """POST /post/bring/
        update user column in posts with post_ids
        """
        try:
            post_ids = request.data["post_ids"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = super().get_queryset()
        profile = Profile.objects.get(user=request.user.id)
        for post in queryset.filter(_id__in=post_ids):
            profile.used_posts.add(post)

        return Response()

    @action(methods=["post"], detail=False, name="Crawl Reddit Posts")
    def crawl(self, request):
        """POST /post/crawl/
        Crawl posts (submissions or comments) from Reddit
        and save to corresponding database.
        """

        try:
            subreddit = request.data["subreddit"]
            after = request.data["after"]
            before = request.data["before"]
            post_type = request.data.get("post_type", None)
            max_size = request.data.get("max_size", None)

        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user:
            profile = Profile.objects.get(user=request.user.id)

        try:
            logger.info(f"request.data: {request.data}")
            reddit = RedditHandler()
            if reddit.run(
                subreddit=subreddit,
                after=after,
                before=before,
                post_type=post_type,
                max_size=max_size,
                profile=profile,
            ):
                return Response(status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(e)

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=["post"], detail=False)
    def delete_all(self, request):
        if request.user:
            profile = Profile.objects.get(user=request.user.id)
            profile.used_posts.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["get"], detail=False)
    def reddit_crawl(self, request):
        reddit = praw.Reddit(
            # client_id="HrX6aV7TW7y3eA",
            # client_secret="_PlGa5VdhUGj3vNkWAvooMuFnBhX6A",
            client_id="vejWNuDSs4Iqmg",
            client_secret="AsVQnCTPFEJSr14Zzd4n3gS43s_fwA",
            redirect_uri="http://localhost:8000/post/reddit_auth",
            user_agent="modsandbox by /u/leesang627",
        )
        return HttpResponseRedirect(
            redirect_to=reddit.auth.url(["identity", "read", "mysubreddits"], "mod", "permanent")
        )

    @action(methods=["get"], detail=False)
    def reddit_auth(self, request):
        code = request.data["code"]
        r = praw.Reddit(
            # client_id="HrX6aV7TW7y3eA",
            # client_secret="_PlGa5VdhUGj3vNkWAvooMuFnBhX6A",
            client_id="vejWNuDSs4Iqmg",
            client_secret="AsVQnCTPFEJSr14Zzd4n3gS43s_fwA",
            user_agent="modsandbox by /u/leesang627",
            redirect_uri="http://localhost:8000/post/reddit_auth",
        )
        print(r.auth.authorize(code))
        for sub in r.user.contributor_subreddits():
            print(sub)
        for spam in r.subreddit("KIXModSandbox").mod.spam():
            print(spam)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
        # print(reddit.user.me())

    # @action(methods=['post'], detail=False)
    # def apply_rules(self, request):
    #     """POST /post/apply_rules/, /post/apply_rules/?reset=false
    #     Default (reset=true):
    #         1. Reset rule_id, line_id columns in database.
    #         2. Apply moderation rules (given as json format in request.body) to posts saved in database & save the results in rule_id, line_id columns in database.

    #     reset=false:
    #         Skip 1. and perform 2. straight away.
    #     """
    #     is_reset = request.query_params.get('reset', 'true')
    #     is_reset = True if is_reset == 'true' else False
    #     rules = request.data

    #     try:
    #         logger.info(f'Request: is_reset({is_reset}), apply rules ({rules})')
    #         rule_handler = RuleHandler()
    #         if is_reset:
    #             rule_handler.reset_rules()
    #         if rule_handler.apply_rules(rules):
    #             return Response(status=status.HTTP_201_CREATED)
    #     except Exception as e:
    #         logger.error(e)
    #     return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=["post"], detail=False)
    def apply_rules(self, request):
        """
        POST /post/apply_rules/
        """
        try:
            yaml = request.data["yaml"]
            rule_set = Ruleset(yaml)
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        profile = Profile.objects.get(user=request.user.id)
        profile.user.rules.all().delete()
        rules = rule_set.rules

        for index, rule in enumerate(rules):
            rule_object = Rule(
                user=profile.user, rule_index=index, content=json.dumps(rule)
            )
            rule_object.save()

        for post in profile.used_posts.all():
            for rule in Rule.objects.filter(user=profile.user):
                rule_target = RuleTarget("Link", json.loads(rule.content))
                if rule_target.check_item(post, ""):
                    post.matching_rules.add(rule)

        return Response(status=status.HTTP_202_ACCEPTED)
