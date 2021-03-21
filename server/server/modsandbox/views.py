import os
import json
import logging
from datetime import datetime
import random

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
from .file_handler import FileHandler
from .ml import (
    compute_cosine_similarity,
    compute_word_frequency_similarity,
    compute_word_frequency,
)


logger = logging.getLogger(__name__)


@api_view(["GET"])
def save_files(request):
    file_handler = FileHandler("../../reddit_archived/RS_2020-04.zst")
    file_handler.run()
    return Response(True)


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
            ["identity", "read", "mysubreddits", "modcontributors"],
            request.user.id,
            "permanent",
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

    # return redirect("http://modsandbox.s3-website.ap-northeast-2.amazonaws.com/")
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


@api_view(["POST"])
def apply_rules(request):
    """
    POST /apply_rules/
    """
    try:
        yaml = request.data["yaml"]
        multiple = request.data["multiple"]
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

    if multiple == True:
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
            is_private = self.request.query_params.get("is_private", "true")
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if is_private == "true":
            queryset = queryset.filter(id__in=profile.used_posts.all())
        elif is_private == "false":
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
            # self.pagination_class = None
            queryset = queryset.filter(matching_rules__in=profile.user.rules.all())
            if sort == "fpfn":
                queryset = queryset.order_by("similarity")
            elif sort == "tptn":
                queryset = queryset.order_by("-similarity")
        elif filtered == "unfiltered":
            queryset = queryset.exclude(matching_rules__in=profile.user.rules.all())
            if sort == "fpfn":
                queryset = queryset.order_by("-similarity")
            elif sort == "tptn":
                queryset = queryset.order_by("similarity")

        return queryset

    @action(methods=["post"], detail=False)
    def add_test(self, request):
        try:
            test_data = request.data
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=request.user.id)
            test_post = Post.objects.create(**test_data)
            profile.used_posts.add(test_post)
            for rule in Rule.objects.filter(user=profile.user):
                rule_target = RuleTarget("Link", json.loads(rule.content))
                if rule_target.check_item(test_post, ""):
                    test_post.matching_rules.add(rule)

            return Response(status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], detail=False)
    def import_test_data(self, request):
        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=request.user.id)
            script_dir = os.path.dirname(__file__)
            with open(
                os.path.join(script_dir, "test_data/corona_virus/normal_comments.json")
            ) as normal_json:
                with open(os.path.join(script_dir, "test_data/corona_virus/removed_comments_no.json")) as removed_json:
                    normal_comments = json.load(normal_json)
                    removed_comments = json.load(removed_json)
                    random.seed(100)
                    comments = random.sample(normal_comments, 500)+random.sample(removed_comments, 50)
                    removed_json.close()
                    normal_json.close()

            with open(
                os.path.join(script_dir, "test_data/corona_virus/removed_comments.json")
            ) as json_file:
                removed_comments = json.load(json_file)
                json_file.close()
            
            try:
                reddit = RedditHandler()
                reddit.test_run(comments, removed_comments, profile)
                return Response(status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.exception(e)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["get"], detail=False)
    def ids(self, request):
        """GET /ids/
        get ids
        """
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=self.request.user.id)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            select_type = request.query_params.get("type", "all")
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if select_type == "all":
            queryset = queryset.filter(id__in=profile.used_posts.all())
        elif select_type == "filtered":
            queryset = queryset.filter(matching_rules__in=profile.user.rules.all())
        elif select_type == "unfiltered":
            queryset = queryset.exclude(matching_rules__in=profile.user.rules.all())

        post_ids = [post.id for post in queryset]
        return Response(post_ids)

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
        for post in queryset.filter(id__in=post_ids):
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
            is_private = request.data["user_imported"]

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
            queryset.filter(profile__pk=request.user.id).filter(id__in=ids).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], detail=False)
    def delete_all(self, request):
        queryset = super().get_queryset()
        if request.user:
            # queryset.filter(profile__pk=request.user.id).delete()
            queryset.all().delete()
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
            posts = queryset.filter(profile__pk=request.user.id).filter(id__in=ids)
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

    @action(methods=["post"], detail=False)
    def apply_seed(self, request):
        try:
            seed = request.data["seed"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user:
            profile = Profile.objects.get(user=request.user.id)
            used_posts = Post.objects.filter(id__in=profile.used_posts.all())
            spam_posts = used_posts.filter(_type__in=[
                "spam_submission",
                "spam_comment",
                "reports_submission",
                "reports_comment",
            ])

            seed_array = [{"_id": "seed", "body": seed}]
            posts_array = [
                {
                    "_id": post._id,
                    "body": post.body,
                }
                for post in spam_posts
            ]
            # compute similarities between seed and filtered posts
            similarities = compute_cosine_similarity(
                seed_array, posts_array
            )  # example of return: [1, 0.8, ..., 0.7]
            for i, post in enumerate(spam_posts):
                post.similarity = similarities[i]
                post.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], detail=False)
    def apply_seeds(self, request):
        try:
            ids = request.data["ids"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user:
            profile = Profile.objects.get(user=request.user.id)
            seeds = Post.objects.filter(id__in=ids)  # Moderated에서 seed로 선택된 포스트들의 집합
            used_posts = Post.objects.filter(
                id__in=profile.used_posts.all()
            )  # Posts에 불러온 모든 포스트
            # filtered_posts = queryset.filter(matching_rules__in=profile.user.rules.all()) # Posts에서 필터링된 포스트들의 집합
            # unfiltered_posts = queryset.exclude(matching_rules__in=profile.user.rules.all()) # 똑같은데 필터링 되지않은 포스트들
            seeds_array = [
                {"_id": seed._id, "body": seed.body if seed.body != "" else seed.title}
                for seed in seeds
            ]  # 이렇게 array를 만든 후에 사용해야 함 (dict[])
            # filtered_posts_array = [{'_id': post._id, 'body': post.body} for post in filtered_posts] # 이렇게 array를 만든 후에 사용해야 함 (dict[])
            posts_array = [
                {
                    "_id": post._id,
                    "body": post.body
                    if post.body not in ["", "[removed]"]
                    else post.title,
                }
                for post in used_posts
            ]

            # 출력 결과
            # seeds_array = [{'_id': 'gk0p7ra', 'body': 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfqwer\n\nqwerqwerqwerqwerqwerqewr'}, {'_id': 'l1p3je', 'body': 'asdfasdfasdfasdfqw\n\n&#x200B;\n\nasdfawerqweqwerqwer\n\nqwerqwerqwer'}]
            # filtered_posts_array =  [{'_id': 'gk0p7ra', 'body': 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfqwer\n\nqwerqwerqwerqwerqwerqewr'}, {'_id': 'l1p3je', 'body': 'asdfasdfasdfasdfqw\n\n&#x200B;\n\nasdfawerqweqwerqwer\n\nqwerqwerqwer'}]
            # filtered_posts_array [{'_id': 'gliel3c', 'body': 'Oh fuck haha'}, {'_id': 'glm9g22', 'body': 'Mechanics is not as important as game knowledge imo. Just playing the map can win most of the times(except 2 lane maps, fuck them)'}, {'_id': 'glmamta', 'body': "Well, people admittedly always like to assume whatever the fuck they want to read is exactly what the writer intended, so yeah, I suppose.\n\nAnyway, now the assumption's been corrected, so there we go."}, {'_id': 'gln4lup', 'body': 'Lots of racist fucks, and lots of kids trying to be edgy or some bullshit, but yeah, Blizzard don’t give a fuck.'}, {'_id': 'glndhpy', 'body': 'The thing about toxic players is that they\'re usually fine or *above average* skill players. The only thing holding them back is the portion of games that they throw due to their inability to control their attitude.\n\nSo when there\'s a player raging the fuck out every game, they\'re probably *better* than average when they\'re happy.\n\nTip #1: Proactively keep your teammates happy. \n\nBe nice in the draft, recommend picks based on what someone\'s played recently or what they have good winrates on. Don\'t pin anyone into a role they don\'t want to play.\n\nDon\'t spam ping. I\'m usually a nice person, but I get triggered by spam pings. I never rage out and throw, but if someone spam pings it\'s hurting my opinion of them.\n\nTip #2: Keep your team ahead in xp. Angry players are less likely to tilt if you\'re ahead.\n\nTake a waveclear hero when solo queuing. No matter what role you need, pick a hero in that role who can clear waves. ETC and Johanna both have waveclear as tanks. If you need to pick up or finish off a wave that your teammates neglect, you *need* to be able to do it in a timely manner. If you\'re struggling to clear a wave, your team is going to die somewhere without you.\n\nThere\'s nothing more frustrating than trying to get oblivious assassins to soak bot lane. It\'s better to pick a hero who\'s capable of doing that alone, so that you don\'t deprive your team of a tank.\n\nTip #3: Play with a friend. If you can play in a party of 2 or 3, you\'re taking up two slots on your team with players you *know* won\'t be toxic. Imagine a toxic player is looking for a match at the same time. There\'s 3 slots on your team and 5 slots on the enemy team for them to get put in. The odds are in your favor. *This only works if you can guarantee you and your friend won\'t ever be toxic. If your friend is a hothead, don\'t play ranked with them.*\n\nTip #4: Encourage forward thinking rather than backward thinking. Rather than look back on who did what, look forward to what needs to happen next fight. Position yourself accordingly, and *maybe* risk communicating a plan to the team and toxic player. \n\nTip #5: Publicly take the blame for anything possible. A toxic player can get angry all they want, but the real devastation is when they continue to be vocal about it. It distracts your team and fuels their anger. However if you just say "my bad, I mispositioned and couldn\'t block for Tassadar (the actual trash player)" then there\'s not much left to argue about. If they say "No it was def Tass that was the problem", you can say "Ya, but I need to position appropriately." Just keep the attention on you, and the anger will usually fade.\n\nTip #6: If you find *yourself* engaging with them, block them and get your last word if you absolutely must to feel complete. Encourage party mates to mute as well just to prevent the morale hit.\n\nTip #7: Follow them everywhere. Just go full "support this guy" mode. Don\'t be mean about it, and if you have to you can say "Please call the shots, I\'ll follow you." Just do things their way. It hurts inside, but it can help.\n\nTip #8: Last ditch effort, if I find they\'re not relenting and are actively engaging in an argument I\'ll say something along the lines of **"How many games have you turned around and won by berating your allies?"**.\n\nA surprising amount of times (maybe 30%?) it stops them in their tracks. No more messages, nothing. \nI\'m convinced that it\'s short enough that they read it, long enough that they have to think for a second before replying, and in that second they realize that they still care about winning the game.\n\nIt also tends to help the victim on your team, because they know you\'re on their side.'}, {'_id': 'glnpqwg', 'body': 'How is it fun or funny to post the same shit over and over again? That sounds juvenile as fuck'}, {'_id': 'glo2fbi', 'body': 'This is the comment i should have replied, because fuck off, oh wow, LoL gave some loot chest for free, what a kind gesture, they probably dont put 25 dollars skins or something, right? and you know that the full set of dragon skins on valorant cost 100 dollars? wow, what great people are there on riot'}, {'_id': 'glo2te7', 'body': 'For the low low price of fuck that.'}, {'_id': 'glwah9q', 'body': "REEEEE FUCKING HIT BOXES HOW THE FUCK DO I GET HIT BY LITERALLY SHIT HALF THE MAP AWAY WHEN I SEE MY SKILL SHOT LITREALLY PASS THROUGH ENEMY HEROES. MAKES NO FUCKING SENSE GIVE ME CLARITY OR MAKE IT SO THAT WHEN ANIMATIONS HIT AN ENEMY HERO THEY ACTUALLY GET FUCKING HIT\n\n&amp;#x200B;\n\nALSO WHERE THE FUCK DO I GET THE TALENT THAT LETS ME LIVE WITH 1 HP EVERY. FREAKING.TIME. HOLY SMOKES THE AMOUNT OF TIMES I'VE LOST BECAUSE I DIDN'T GET TO PICK THAT TALENT IS MADDENING"}]

            # 여기에 구현하시면 됩니다.

            # compute similarities between seed and filtered posts
            similarities = compute_cosine_similarity(
                seeds_array, posts_array
            )  # example of return: [1, 0.8, ..., 0.7]
            for i, post in enumerate(used_posts):
                post.similarity = similarities[i]
                post.save()
            return Response(status=status.HTTP_201_CREATED)
            # assert len(similarities) == len(filtered_post_array)
            # return Response({'_id': post._id, 'similarity': similarities[i]} for i, post in enumerate(filtered_posts))
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["post"], detail=False)
    def word_variation(self, request):
        try:
            keyword = request.data["keyword"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user:
            profile = Profile.objects.get(user=request.user.id)
            used_posts = Post.objects.filter(
                id__in=profile.used_posts.all(), _type__in=["submission", "comment"]
            )
            used_spams = Post.objects.filter(
                id__in=profile.used_posts.all(),
                _type__in=[
                    "spam_submission",
                    "spam_comment",
                    "reports_submission",
                    "reports_comment",
                ],
            )
            posts_array = [
                {
                    "_id": post._id,
                    "body": post.body
                    if post.body not in ["", "[removed]"]
                    else post.title,
                }
                for post in used_posts
            ]
            spams_array = [
                {
                    "_id": post._id,
                    "body": post.body
                    if post.body not in ["", "[removed]"]
                    else post.title,
                }
                for post in used_spams
            ]

            word_freq_sim = compute_word_frequency_similarity(
                posts_array, spams_array, keyword
            )
            return Response(word_freq_sim)

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
            queryset = queryset.filter(id__in=profile.used_posts.all())
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
            if sort == "fpfn":
                queryset = queryset.order_by("similarity")
            elif sort == "tptn":
                queryset = queryset.order_by("-similarity")
        elif filtered == "unfiltered":
            queryset = queryset.exclude(matching_rules__in=profile.user.rules.all())
            if sort == "fpfn":
                queryset = queryset.order_by("-similarity")
            elif sort == "tptn":
                queryset = queryset.order_by("similarity")

        return queryset

    @action(methods=["get"], detail=False)
    def ids(self, request):
        """GET /ids/
        get ids
        """
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            profile = Profile.objects.get(user=self.request.user.id)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            select_type = request.query_params.get("type", "all")
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if select_type == "all":
            queryset = queryset.filter(id__in=profile.used_posts.all())
        elif select_type == "filtered":
            queryset = queryset.filter(matching_rules__in=profile.user.rules.all())
        elif select_type == "unfiltered":
            queryset = queryset.exclude(matching_rules__in=profile.user.rules.all())

        post_ids = [post.id for post in queryset]
        return Response(post_ids)

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
            moderator_name = request.data["moderator_name"]
            reported_by = request.data["reported_by"]
            if praw_handler.run(
                profile=profile,
                subreddit_name=subreddit_name,
                mod_type=mod_type,
                removal_reason=removal_reason,
                community_rule=community_rule,
                moderator_name=moderator_name,
                reported_by=reported_by,
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
            queryset.filter(profile__pk=request.user.id).filter(id__in=ids).delete()
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
            posts = queryset.filter(profile__pk=request.user.id).filter(id__in=ids)
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

    @action(methods=["post"], detail=False)
    def word_frequency(self, request):
        try:
            ids = request.data["ids"]
        except Exception as e:
            logger.error(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user:
            selected_posts = Post.objects.filter(id__in=ids)
            posts_array = [
                {"_id": post._id, "body": post.body} for post in selected_posts
            ]
            word_freq = compute_word_frequency(posts_array)
            return Response(word_freq)

        return Response(status=status.HTTP_401_UNAUTHORIZED)
