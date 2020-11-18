from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Submission, Comment
from .serializers import SubmissionSerializer, CommentSerializer 

# class SubmissionViewSet(viewsets.ModelViewSet):
#     queryset = Submission.objects.all()
#     serializer_class = SubmissionSerializer

# class CommentViewSet(viewsets.ModelViewSet):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer

class DataHandlerView(viewsets.ViewSet):
    
    def list(self, request):
        """
        http method: GET
        url: /data/ 
        """
        queryset = Submission.objects.all()
        serializer = SubmissionSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        http method: GET
        url: /data/{pk}
        """
        queryset = Submission.objects.all()
        res = get_object_or_404(queryset, pk=pk)
        serializer = CommentSerializer(res)
        
        return Response(serializer.data)

    @action(methods=['post'], detail=False)
    def set_password(self, request):
        return Response({'set': 1})


