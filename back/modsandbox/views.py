import json
import os
import logging
from types import SimpleNamespace

import pandas as pd
import numpy as np
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

from django.shortcuts import redirect
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status, filters
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
import praw

from modsandbox.filters import PostFilter, ConfigFilter
from modsandbox.ml import process_embedding
from modsandbox.pinecone_handler import create_index_pinecone, get_index_pinecone
from modsandbox.post_handler import create_posts, get_filtered_posts, get_unfiltered_posts, get_df_posts_vector, \
    get_average_vector, get_embedding_post, create_test_posts
from modsandbox.models import Post, User, Rule, Config, Log, CheckCombination, Check
from modsandbox.paginations import PostPagination
from modsandbox.reddit_handler import RedditHandler
from modsandbox.rule_handler import apply_config
from modsandbox.serializers import PostSerializer, RuleSerializer, StatSerializer, ConfigSerializer, LogSerializer
from modsandbox.stat_handler import after_to_time_interval, get_time_interval

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

        return redirect('http://modsandbox.s3-website.ap-northeast-2.amazonaws.com/')
        # return redirect('http://localhost:3000/')

    @action(methods=['get'], detail=False)
    def logout(self, request):
        request.user.reddit_token = ''
        request.user.save()

        return Response(status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def mod_subreddits(self, request):
        r = RedditHandler(request.user)
        return Response(r.get_mod_subreddits())


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place__startswith='normal')
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = PostFilter
    ordering_fields = ['sim', 'created_utc', 'score']

    def get_queryset(self):
        queryset = self.queryset.filter(user=self.request.user)
        try:
            rule_id = self.request.query_params.get("rule_id")
            check_id = self.request.query_params.get("check_id")
            config_id = self.request.query_params.get("config_id")
            check_combination_id = self.request.query_params.get("check_combination_id")
            filtered = self.request.query_params.get("filtered")
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if filtered == 'true':
            queryset = get_filtered_posts(queryset, config_id, rule_id, check_combination_id, check_id)

        elif filtered == 'false':
            queryset = get_unfiltered_posts(queryset, config_id, rule_id, check_combination_id, check_id)

        return queryset

    def create(self, request, *args, **kwargs):
        subreddit = request.data.get('subreddit')
        after = request.data.get('after')
        where = request.data.get('where')
        type = request.data.get('type')
        use_author = request.data.get('use_author')

        if subreddit == '':
            return Response(status=status.HTTP_400_BAD_REQUEST)

        r = RedditHandler(request.user)

        if where == 'Subreddit':
            pushshift_posts = r.get_posts_from_pushshift(subreddit, after, type)
            posts = create_posts(pushshift_posts, request.user, "normal", use_author)

        elif where == 'Spam':
            r.get_mod_subreddits()
            praw_spams = r.get_spams_from_praw(subreddit, after, type)
            posts = create_posts(praw_spams, request.user, "normal", use_author)

        else:  # for lab study
            with open(os.path.join(os.path.dirname(__file__),
                                   'test_data/submission_cscareerquestions_may_1st_labeled.json')) as normal_json:
                normal = json.load(normal_json)
                normal_json.close()

            normal_posts = ([
                SimpleNamespace(
                    **{
                        'id': post['id'],
                        'author': SimpleNamespace(**{
                            'name': post['author_name'],
                            'link_karma': post['author_link_karma'],
                            'comment_karma': post['author_comment_karma'],
                            'created_utc': post['author_created_utc'],
                        }),
                        'title': post['title'],
                        'name': post['name'],
                        'selftext': post['body'],
                        'created_utc': post['created_utc'],
                        'banned_by': None,
                        'num_reports': None,
                        'permalink': post['permalink'],
                        'score': post['score'],
                        'rule_1': post['rule_1'],
                        'rule_2': post['rule_2'],
                    })
                for post in normal])

            posts = create_test_posts(normal_posts, request.user, 'normal')

        configs = Config.objects.filter(user=request.user)
        for config in configs:
            apply_config(config, posts, False)

        df_posts_vector = get_df_posts_vector(posts)
        vector_path = os.path.join(os.path.dirname(__file__), 'vector_db',
                                   'post_vectors_' + request.user.username + '.pkl')
        df_posts_vector.to_pickle(vector_path)
        # create_index_pinecone(request.user.username)
        # index = get_index_pinecone(request.user.username)
        # index.upsert(items=zip(df_posts_vector.id, df_posts_vector.vector), namespace='fn', batch_size=1000)
        # print('Pinecone indexing finish!', index.info(namespace='fn'))

        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        Post.objects.filter(user=request.user).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['get'], detail=False)
    def search(self, request):
        query = self.request.query_params.get("query")
        sort = self.request.query_params.get("sort")
        posts = self.queryset.filter(user=request.user)
        searched_posts = posts.filter(body__icontains=query) | posts.filter(title__icontains=query)
        # for postgresql
        if sort == 'relevance':
            search_vector = SearchVector('title', 'body')
            search_query = SearchQuery(query)
            searched_posts = searched_posts.annotate(rank=SearchRank(search_vector, search_query)).order_by('-rank')
        elif sort == 'new':
            searched_posts = searched_posts.order_by('-created_utc')
        elif sort == 'top':
            searched_posts = searched_posts.order_by('-score')

        return Response(PostSerializer(searched_posts, many=True).data)

    @action(methods=['post'], detail=False)
    def fpfn(self, request):
        posts = Post.objects.filter(user=request.user)
        normal_posts = posts.filter(place__startswith='normal')
        target_posts = posts.filter(place__in=['target', 'normal-target'])
        target_vector = get_average_vector([get_embedding_post(post) for post in target_posts])
        vector_path = os.path.join(os.path.dirname(__file__), 'vector_db',
                                   'post_vectors_' + request.user.username + '.pkl')
        post_vectors = pd.read_pickle(vector_path)
        if target_vector is not None:
            for post in normal_posts:
                post_vector = post_vectors[post_vectors.id == post.id].vector
                post.sim = np.inner(post_vector.tolist(), target_vector.tolist())[0]
                post.save()

            # Post.objects.bulk_update(normal_posts, ['sim'])
        else:
            posts.update(sim=0)

        return Response(status=status.HTTP_200_OK)


class FpFnViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place__startswith='normal')
    serializer_class = PostSerializer
    pagination_class = PostPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = PostFilter
    ordering_fields = ['sim_fp', 'sim_fn']
    ordering = ['sim_fp']

    def get_queryset(self):
        queryset = self.queryset.filter(user=self.request.user)
        try:
            filtered = self.request.query_params.get("filtered")
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if filtered == 'true':
            queryset = queryset.filter(sim_fp__isnull=False)
        else:
            queryset = queryset.filter(sim_fn__isnull=False)
        return queryset

    def create(self, request, *args, **kwargs):
        posts = self.queryset.filter(user=self.request.user)
        posts.update(sim_fp=None, sim_fn=None)
        target_posts = posts.filter(place__in=['target', 'normal-target'])

        rule_id = self.request.data.get("rule_id")
        check_id = self.request.data.get("check_id")
        config_id = self.request.data.get("config_id")
        check_combination_id = self.request.data.get("check_combination_id")

        filtered_posts = get_filtered_posts(posts, config_id, rule_id, check_combination_id, check_id)
        df_filtered_vector = get_df_posts_vector(filtered_posts)

        index = get_index_pinecone(request.user.username)
        index.delete(ids=df_filtered_vector.id, namespace='fn')
        index.upsert(items=zip(df_filtered_vector.id, df_filtered_vector.vector), namespace='fp', batch_size=1000)
        print(index.info(namespace='fp'), index.info(namespace='fn'))
        target_vector = get_average_vector([get_embedding_post(post) for post in target_posts])
        fn_result = index.query(queries=[target_vector], top_k=500, namespace='fn')
        fp_result = index.query(queries=[(target_vector * -1)], top_k=500, namespace='fp')
        if fn_result:
            for i, post_id in enumerate(fn_result[0].ids):
                fn_post = posts.get(id=post_id)
                fn_post.sim_fn = fn_result[0].scores[i]
                fn_post.save()
        if fp_result:
            for i, post_id in enumerate(fp_result[0].ids):
                fp_post = posts.get(id=post_id)
                fp_post.sim_fp = fp_result[0].scores[i]
                fp_post.save()

        index.delete(ids=df_filtered_vector.id, namespace='fp')
        index.upsert(items=zip(df_filtered_vector.id, df_filtered_vector.vector), namespace='fn', batch_size=1000)
        print(index.info(namespace='fp'), index.info(namespace='fn'))

        return Response(status=status.HTTP_201_CREATED)


class TargetViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place__in=['target', 'normal-target'])
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    ordering = ['created_utc']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        full_name = request.data.get('full_name')
        use_author = request.data.get('use_author')
        if full_name:
            r = RedditHandler(request.user)
            target_post = r.get_post_with_id(full_name)
            posts = create_posts([target_post], request.user, "target", use_author)
        else:
            post = Post(user=request.user)
            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid(raise_exception=True):
                new_post = serializer.save()
                posts = Post.objects.filter(id=new_post.id)
        configs = Config.objects.filter(user=request.user)
        for config in configs:
            apply_config(config, posts, False)
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.place == 'target':
            self.perform_destroy(instance)
        elif instance.place == 'normal-target':
            instance.place = 'normal'
            instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        self.queryset.filter(user=request.user).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ExceptViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(place__in=['except', 'normal-except'])
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    ordering = ['created_utc']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        full_name = request.data.get('full_name')
        use_author = request.data.get('use_author')
        if full_name:
            r = RedditHandler(request.user)
            except_post = r.get_post_with_id(full_name)
            posts = create_posts([except_post], request.user, "except", use_author)
        else:
            post = Post(user=request.user)
            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid(raise_exception=True):
                new_post = serializer.save()
                posts = Post.objects.filter(id=new_post.id)
        configs = Config.objects.filter(user=request.user)
        for config in configs:
            apply_config(config, posts, False)
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.place == 'except':
            self.perform_destroy(instance)
        elif instance.place == 'normal-except':
            instance.place = 'normal'
            instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        self.queryset.filter(user=request.user).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ConfigViewSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ConfigFilter
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.code = request.data.get('code')
        instance.rules.all().delete()
        instance.save()
        posts = Post.objects.filter(user=self.request.user)
        apply_config(instance, posts, True)
        serializer = self.get_serializer(instance)
        self.perform_update(serializer)

        return Response(serializer.data)

    @action(methods=['delete'], detail=False)
    def all(self, request):
        self.queryset.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StatViewSet(PostViewSet):
    serializer_class = StatSerializer
    pagination_class = None

    @action(detail=False, methods=['get'])
    def graph(self, request):
        queryset = self.get_queryset().filter(place__startswith='normal')

        posts = Post.objects.filter(user=request.user, place__startswith='normal')
        data_array = []
        # datetime_interval = after_to_time_interval(after, 30)
        if posts:
            end = posts.latest('created_utc').created_utc
            start = posts.earliest('created_utc').created_utc
            datetime_interval = get_time_interval(start, end, 30)
            data_array = [
                {'x0': interval[0], 'x1': interval[1], 'y': queryset.filter(created_utc__range=interval).count()}
                for interval in datetime_interval]

        return Response(data_array)

    @action(detail=False, methods=['get'])
    def setting(self, request):
        queryset = self.queryset.filter(user=request.user)
        live_submissions = queryset.filter(post_type='Submission', source='Subreddit')
        live_comments = queryset.filter(post_type='Comment', source='Subreddit')
        spam_submissions = queryset.filter(post_type='Submission', source__in=['Spam', 'Report'])
        spam_comments = queryset.filter(post_type='Comment', source__in=['Spam', 'Report'])
        try:
            recent_live_sub_utc = live_submissions.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_live_sub_utc = None
        try:
            recent_live_com_utc = live_comments.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_live_com_utc = None
        try:
            recent_spam_sub_utc = spam_submissions.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_spam_sub_utc = None
        try:
            recent_spam_com_utc = spam_comments.latest('-created_utc').created_utc
        except Post.DoesNotExist:
            recent_spam_com_utc = None

        return Response({
            "live_sub_recent": recent_live_sub_utc,
            "live_com_recent": recent_live_com_utc,
            "live_sub_count": live_submissions.count(),
            "live_com_count": live_comments.count(),
            "spam_sub_recent": recent_spam_sub_utc,
            "spam_com_recent": recent_spam_com_utc,
            "spam_sub_count": spam_submissions.count(),
            "spam_com_count": spam_comments.count(),
        })


class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        task = request.data.get('task')
        info = request.data.get('info')
        content = request.data.get('content')
        move_to = request.data.get('move_to')
        post_id = request.data.get('post_id')
        config_id = request.data.get('config_id')
        rule_id = request.data.get('rule_id')
        check_combination_id = request.data.get('check_combination_id')
        check_id = request.data.get('check_id')

        post = Post.objects.filter(pk=post_id).first()
        config = Config.objects.filter(pk=config_id).first()
        rule = Rule.objects.filter(pk=rule_id).first()
        check_combination = CheckCombination.objects.filter(pk=check_combination_id).first()
        check = Check.objects.filter(pk=check_id).first()

        Log.objects.create(user=request.user, task=task, info=info, content=content, move_to=move_to, post=post,
                           config=config, rule=rule, check_combination=check_combination, _check=check)

        return Response(status=status.HTTP_201_CREATED)
