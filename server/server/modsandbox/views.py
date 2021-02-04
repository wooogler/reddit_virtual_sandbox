import os
import json
import logging
from datetime import datetime

import praw
from django.shortcuts import redirect
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .praw_handler import PrawHandler
from .models import Post, Profile, Rule
from .serializers import PostSerializer
from .automod import Ruleset, RuleTarget
from .pagintations import PostPagination
from .reddit_handler import RedditHandler


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
            ["identity", "read", "mysubreddits", "modcontributors"], request.user.id, "permanent"
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

    return redirect("http://modsandbox.s3-website.ap-northeast-2.amazonaws.com/")

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


@api_view(["POST"])
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


@api_view(["GET"])
def mod_subreddits(request):
    profile = Profile.objects.get(user=request.user.id)
    praw_handler = PrawHandler(profile.reddit_token)
    return Response(praw_handler.get_mod_subreddits())

@api_view(["GET"])
def removal_reasons(request):
    try:
        subreddit_name = request.query_params.get("param")
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    profile = Profile.objects.get(user=request.user.id)
    praw_handler = PrawHandler(profile.reddit_token)
    return Response(praw_handler.get_removal_reasons(subreddit_name))

@api_view(["GET"])
def community_rules(request):
    try:
        subreddit_name = request.query_params.get("param")
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    profile = Profile.objects.get(user=request.user.id)
    praw_handler = PrawHandler(profile.reddit_token)
    return Response(praw_handler.get_community_rules(subreddit_name))

@api_view(["GET"])
def get_moderators(request):
    try:
        subreddit_name = request.query_params.get("param")
    except Exception as e:
        logger.error(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    profile = Profile.objects.get(user=request.user.id)
    praw_handler = PrawHandler(profile.reddit_token)
    return Response(praw_handler.get_moderators(subreddit_name))

class PostHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(_type__in=["submission", "comment"])
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=self.request.user.id)
            
        try:
            post_type = self.request.query_params.get("post_type", "all")
            sort = self.request.query_params.get("sort", "new")
            filtered = self.request.query_params.get("filtered", "all")
            is_private = self.request.query_params.get('is_private', 'true')
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if is_private == 'true':
            queryset = queryset.filter(_id__in=profile.used_posts.all())
        elif is_private == 'false':
            queryset = queryset.filter(profile__isnull=True)

        if post_type == "all":
            queryset = queryset.all()
        else:
            queryset = queryset.filter(_type=post_type)

        if sort == "new":
            queryset = queryset.order_by("-created_utc")
        elif sort == "old":
            queryset = queryset.order_by("created_utc")
        elif sort == "votes_desc":
            queryset = queryset.order_by("-votes")
        elif sort == "votes_asc":
            queryset = queryset.order_by("votes")
        
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
            post_type = request.data.get("post_type", "all")
            max_size = request.data.get("max_size", None)
            is_private = request.data['user_imported']

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
                profile=profile if is_private else None,
            ):
                return Response(status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception(e)

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=["post"], detail=False)
    def deletes(self, request):
        try:
            ids = request.data["ids"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = super().get_queryset()
        if request.user:
            queryset.filter(profile__pk=request.user.id).filter(_id__in=ids).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], detail=False)
    def delete_all(self, request):
        queryset = super().get_queryset()
        if request.user:
            queryset.filter(profile__pk=request.user.id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], detail=False)
    def moves(self, request):
        try:
            ids = request.data["ids"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = super().get_queryset()
        if request.user:
            profile = Profile.objects.get(user=request.user.id)
            posts = queryset.filter(profile__pk=request.user.id).filter(_id__in=ids)
            for post in posts:
                post.banned_by = profile.username
                post.banned_at_utc = datetime.now()
                if post._type == "submission":
                    post._type = "spam_submission"
                elif post._type == "comment":
                    post._type = "spam_comment"
                post.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)


class SpamHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(
        _type__in=[
            "spam_submission",
            "spam_comment",
            "reports_submission",
            "reports_comment",
        ]
    )
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=self.request.user.id)
            queryset = queryset.filter(_id__in=profile.used_posts.all())
        else:
            queryset = queryset.filter(profile__isnull=True)
        post_type = self.request.query_params.get("post_type", "all")
        sort = self.request.query_params.get("sort", "created-new")
        filtered = self.request.query_params.get("filtered", "all")

        if post_type == "all":
            queryset = queryset.all()
        elif post_type == "submission":
            queryset = queryset.filter(
                _type__in=["spam_submission", "reports_submission"]
            )
        elif post_type == "comment":
            queryset = queryset.filter(_type__in=["spam_comment", "reports_comment"])

        if sort == "created-new":
            queryset = queryset.order_by("-created_utc")
        elif sort == "created-old":
            queryset = queryset.order_by("created_utc")
        if sort == "banned-new":
            queryset = queryset.order_by("-banned_at_utc")
        elif sort == "banned-old":
            queryset = queryset.order_by("banned_at_utc")

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
            praw_handler = PrawHandler(profile.reddit_token)
            subreddit_name = request.data["subreddit_name"]
            mod_type = request.data["mod_type"]
            removal_reason = request.data["removal_reason"]
            community_rule = request.data["community_rule"]
            moderator_name = request.data['moderator_name']
            reported_by = request.data['reported_by']
            if praw_handler.run(
                profile=profile, subreddit_name=subreddit_name, mod_type=mod_type, 
                removal_reason=removal_reason, community_rule=community_rule, moderator_name=moderator_name,
                reported_by=reported_by
            ):
                return Response(status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["post"], detail=False)
    def deletes(self, request):
        try:
            ids = request.data["ids"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = super().get_queryset()
        if request.user:
            queryset.filter(profile__pk=request.user.id).filter(_id__in=ids).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], detail=False)
    def delete_all(self, request):
        queryset = super().get_queryset()
        if request.user:
            queryset.filter(profile__pk=request.user.id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], detail=False)
    def moves(self, request):
        try:
            ids = request.data["ids"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = super().get_queryset()
        if request.user:
            profile = Profile.objects.get(user=request.user.id)
            posts = queryset.filter(profile__pk=request.user.id).filter(_id__in=ids)
            for post in posts:
                post.banned_by = None
                post.banned_at_utc = None
                if post._type == ("spam_submission" or "reports_submission"):
                    post._type = "submission"
                elif post._type == ("spam_comment" or "reports_comment"):
                    post._type = "comment"
                post.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)
