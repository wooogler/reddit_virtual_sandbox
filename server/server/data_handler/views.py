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

from .models import Submission, Comment
from .reddit_handler import RedditHandler
from .rule_handler import RuleHandler
from .serializers import SubmissionSerializer, CommentSerializer 

# class SubmissionViewSet(viewsets.ModelViewSet):
#     queryset = Submission.objects.all()
#     serializer_class = SubmissionSerializer

# class CommentViewSet(viewsets.ModelViewSet):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer

logger = logging.getLogger(__name__)

class DataHandlerView(viewsets.ViewSet):
    def list(self, request):
        """GET /data/, /data/?post_type=comment
        """
        post_type = request.query_params.get('post_type', 'submission')
        sort = request.query_params.get('sort', 'new')
        page = request.query_params.get('page', 1)
        logger.info(f'Request: {post_type}, Sort: {sort}')

        if post_type == 'submission':
            queryset = Submission.objects.all()
        elif post_type == 'comment':
            queryset = Comment.objects.all()

        if sort == 'new':
            paginator = Paginator(queryset.order_by('-created_utc'), 100)
        elif sort == 'old':
            paginator = Paginator(queryset.order_by('created_utc'), 100)
        
        try: 
            posts = paginator.page(page)
        except:
            posts = []

        if post_type == 'submission':
            serializer = SubmissionSerializer(posts, many=True)
        elif post_type == 'comment':
            serializer = CommentSerializer(posts, many=True)
        
            
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """GET /data/{pk}, /data/{pk}/?link_comments=true
        """
        post = get_object_or_404(Submission, pk=pk)
        link_comments = request.query_params.get('link_comments', 'false')
        link_comments = True if link_comments == 'true' else False
        submission = SubmissionSerializer(post).data
        
        res = {'submission': submission}
        if link_comments:
            res['comments'] = []
            for comment in post.comment_set.all():
                res['comments'].append(CommentSerializer(comment).data)
        
        return Response(res, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False)
    def save_to_database(self, request):
        """POST /data/save_to_database/
        Crawl posts (submissions or comments) from Reddit
        and save to corresponding database.
        """

        try:
            subreddit = request.data['subreddit']
            start_time = request.data['start_time']
            end_time = request.data['end_time']
            post_type = request.data.get('post_type', 'submission')
            
            start_ts = int(datetime.strptime(start_time, "%Y-%m-%d-%H:%M:%S").replace(tzinfo=timezone.utc).timestamp())
            end_ts = int(datetime.strptime(end_time, "%Y-%m-%d-%H:%M:%S").replace(tzinfo=timezone.utc).timestamp())
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            logger.info(f'Request: subreddit({subreddit}), '
            f'start_time({start_time}), end_time({end_time}), '
            f'start_ts({start_ts}), end_ts({end_ts}), post_type({post_type})')
            reddit = RedditHandler()
            if reddit.get_and_save_posts(
                subreddit=subreddit, start_ts=start_ts, end_ts=end_ts,
                post_type=post_type,
                submission_table=Submission, comment_table=Comment
            ):
                return Response(status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(e)

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['post'], detail=False)
    def apply_rules(self, request):
        """POST /data/apply_rules/, /data/apply_rules/?reset=false
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
