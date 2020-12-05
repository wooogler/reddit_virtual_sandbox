import logging
from datetime import datetime, timezone

from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404

from .models import Post
from .reddit_handler import RedditHandler
from .rule_handler import RuleHandler
from .serializers import PostSerializer


logger = logging.getLogger(__name__)

class PostHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes ?

    def list(self, request):
        """GET /post/, /post/?type=comment
        """
        post_type = request.query_params.get('type', None)
        sort = request.query_params.get('sort', 'new')
        page = request.query_params.get('page', 1)
        logger.info(f'request.query_params: {request.query_params}')

        if not post_type:
            queryset = Post.objects.all()
        else:
            queryset = Post.objects.filter(_type=post_type)

        if sort == 'new':
            paginator = Paginator(queryset.order_by('-created_utc'), 100)
        elif sort == 'old':
            paginator = Paginator(queryset.order_by('created_utc'), 100)
        
        try: 
            posts = paginator.page(page)
        except:
            posts = []
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

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
