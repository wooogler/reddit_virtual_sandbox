import logging
from datetime import datetime, timezone

from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Submission, Comment
from .reddit_handler import RedditHandler
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
        """GET /data/ 
        """
        queryset = Submission.objects.all()
        serializer = SubmissionSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """GET /data/{pk}
        """
        queryset = Submission.objects.all()
        res = get_object_or_404(queryset, pk=pk)
        serializer = CommentSerializer(res)
        
        return Response(serializer.data)

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
            logger.info(f'Request: subreddit({subreddit}), start_time({start_time}), end_time({end_time}), start_ts({start_ts}), end_ts({end_ts}), post_type({post_type})')
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
