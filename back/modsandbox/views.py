import os
import logging

from django.shortcuts import redirect
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
import praw

from modsandbox.models import Post, User
from modsandbox.paginations import PostPagination
from modsandbox.reddit_handler import RedditHandler
from modsandbox.serializers import PostSerializer

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

        return redirect('http://localhost:3000/settings')

    @action(methods=['get'], detail=False)
    def logout(self, request):
        request.user.reddit_token = ''
        request.user.save()

        return Response(status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def mod_subreddits(self, request):
        r = RedditHandler(request.user)
        return Response(r.get_mod_subreddits())


class PostHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        subreddit = request.data.get('subreddit')
        after = request.data.get('after')
        type = request.data.get('type')

        if subreddit == '':
            return Response(status=status.HTTP_400_BAD_REQUEST)

        r = RedditHandler(request.user)
        r.crawl(subreddit, after, type)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        super().get_queryset().all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TargetHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place='target')
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class ExceptHandlerViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place='except')
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
