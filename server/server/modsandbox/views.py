import logging
import json
import praw
import os

# Create your views here.

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import redirect
from .models import Post, Profile, Rule
from .reddit_handler import RedditHandler
from .praw_handler import PrawHandler
from .automod import Ruleset, RuleTarget
from .serializers import PostSerializer
from .pagintations import PostPagination


logger = logging.getLogger(__name__)


@api_view(["GET"])
def reddit_login(request):
    """
    response the reddit login page
    """
    reddit = praw.Reddit(
        client_id=os.environ.get("client_id"),
        client_secret=os.environ.get("client_secret"),
        redirect_uri=os.environ.get("redirect_uri"),
        user_agent=os.environ.get("user_agent"),
    )
    return Response(
        reddit.auth.url(
            ["identity", "read", "mysubreddits"], request.user.id, "permanent"
        )
    )


@api_view(["GET"])
def reddit_auth(request):
    """
    response token for reddit auth
    """
    try:
        code = request.query_params.get("code")
        state = request.query_params.get("state")
        print(code)
        r = praw.Reddit(
            client_id=os.environ.get("client_id"),
            client_secret=os.environ.get("client_secret"),
            redirect_uri=os.environ.get("redirect_uri"),
            user_agent=os.environ.get("user_agent"),
        )
        token = r.auth.authorize(code)
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    profile = Profile.objects.get(user=state)
    profile.reddit_token = token
    profile.save()

    return redirect("http://localhost:3000/")


@api_view(["GET"])
def reddit_logged(request):
    profile = Profile.objects.get(user=request.user.id)
    if profile.reddit_token != "":
        return Response(True)
    else:
        return Response(False)


@api_view(["GET"])
def reddit_logout(request):
    try:
        profile = Profile.objects.get(user=request.user.id)
        profile.reddit_token = ""
        profile.save()
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def apply_rules(request):
    """
    POST /apply_rules/
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


class PostHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(_type__in=["submission", "comment"])
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

    @action(methods=["post"], detail=False, name="Crawl Posts from pushshift")
    def crawl(self, request):
        """POST /post/crawl/
        Crawl posts (submissions or comments) from Pushshift
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
            profile.used_posts.filter(_type__in=['submission', 'comment']).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

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


class SpamHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(_type__in=["spam_submission", "spam_comment"])
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

    @action(methods=["post"], detail=False, name="Crawl Spams from PRAW")
    def crawl(self, request):
        """POST /spam/crawl/
        Crawl spam posts (submissions or comments) from reddit using praw
        and save to corresponding database.
        """
        if request.user:
            profile = Profile.objects.get(user=request.user.id)

        try:
            praw_hanlder = PrawHandler(profile.reddit_token)
            if praw_hanlder.run(profile=profile):
                return Response(status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=False)
    def delete_all(self, request):
        if request.user:
            profile = Profile.objects.get(user=request.user.id)
            profile.used_posts.filter(_type__in=['spam_submission', 'spam_comment']).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)
