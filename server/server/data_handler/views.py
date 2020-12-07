import logging
from datetime import datetime, timezone

from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Post, Profile, User
from .reddit_handler import RedditHandler
from .rule_handler import RuleHandler
from .serializers import PostSerializer, ProfileSerializer


logger = logging.getLogger(__name__)

class PostPagination(PageNumberPagination):
    page_size=50

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
        post_type = self.request.query_params.get('type', None)
        sort = self.request.query_params.get('sort', 'new')

        if not post_type:
            queryset = queryset.all()
        else:
            queryset = queryset.filter(_type=post_type)
        
        if sort == 'new':
            queryset = queryset.order_by('-created_utc')
        elif sort == 'old':
            queryset = queryset.order_by('created_utc')

        return queryset


    @action(methods=['post'], detail=False, name='Bring Reddit Posts')
    def bring(self, request):
        """POST /post/bring/
        update user column in posts with post_ids
        """
        try: 
            post_ids = request.data['post_ids']
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = super().get_queryset()
        profile = Profile.objects.get(user=request.user.id)
        for post in queryset.filter(_id__in=post_ids):
            profile.used_posts.add(post)

        return Response()
        
        

    @action(methods=['post'], detail=False, name='Crawl Reddit Posts')
    def crawl(self, request):
        """POST /post/crawl/
        Crawl posts (submissions or comments) from Reddit
        and save to corresponding database.
        """

        try:
            subreddit = request.data['subreddit']
            start_time = request.data['start_time']
            end_time = request.data['end_time']
            post_type = request.data.get('type', None)
            max_size = request.data.get('max_size', 200)

            start_ts = int(datetime.strptime(start_time, "%Y-%m-%d-%H:%M:%S").replace(tzinfo=timezone.utc).timestamp())
            end_ts = int(datetime.strptime(end_time, "%Y-%m-%d-%H:%M:%S").replace(tzinfo=timezone.utc).timestamp())
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            logger.info(f'request.data: {request.data}')
            reddit = RedditHandler()
            if reddit.run(
                subreddit=subreddit,
                start_ts=start_ts,
                end_ts=end_ts,
                post_type=post_type,
                max_size=max_size
            ):
                return Response(status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(e)

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['post'], detail=False)
    def apply_rules(self, request):
        """POST /post/apply_rules/, /post/apply_rules/?reset=false
        Default (reset=true):
            1. Reset rule_id, line_id columns in database.
            2. Apply moderation rules (given as json format in request.body) to posts saved in database & save the results in rule_id, line_id columns in database.

        reset=false:
            Skip 1. and perform 2. straight away.
        """
        is_reset = request.query_params.get('reset', 'true')
        is_reset = True if is_reset == 'true' else False
        rules = request.data

        try:
            logger.info(f'Request: is_reset({is_reset}), apply rules ({rules})')
            rule_handler = RuleHandler()
            if is_reset:
                rule_handler.reset_rules()
            if rule_handler.apply_rules(rules):
                return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(e)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
