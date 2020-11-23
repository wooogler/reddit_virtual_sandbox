from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions
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
        """
        # TODO: Check if request is valid format.
        
        subreddit = request.data['subreddit']
        start_time = request.data['start_time']
        end_time = request.data['end_time']
        try:
            start_ts = math.ceil(datetime.strptime(args.start_date, "%Y-%m-%d-%H:%M:%S").timestamp())
            end_ts = math.ceil(datetime.strptime(args.end_date, "%Y-%m-%d-%H:%M:%S").timestamp())
            
            reddit = reddit_handler.RedditHandler()
            status = reddit.get_and_save_posts(
                subreddit=subreddit, start_at=start_ts, end_at=end_ts,
                submission_table=Submission, comment_table=Comment
            )
            status = 200 if status == True else 500
            return Response({'status': status})

        except:
            return Response({'status': 500})
