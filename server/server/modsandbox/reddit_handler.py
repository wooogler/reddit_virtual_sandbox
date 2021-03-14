import os
import json
import time
import logging
import requests
from datetime import datetime, timezone

import praw

from .models import Post


logger = logging.getLogger(__name__)


class RedditHandler:
    def __init__(self):
        self.endpoint = {
            "submission": "https://api.pushshift.io/reddit/search/submission",
            "comment": "https://api.pushshift.io/reddit/search/comment",
        }
        self.request_size = 100

        self.reddit = praw.Reddit(
            client_id=os.environ.get("client_id"),
            client_secret=os.environ.get("client_secret"),
            user_agent=os.environ.get("user_agent"),
        )
        self.script_dir = os.path.dirname(__file__)

    def _get_reddit_posts(self, uri, params, max_retries=4, removed=False):
        """Send HTTP request to 'uri'

        Returns:
            list(dict): posts.
        """
        trials = 1
        while trials < max_retries:
            try:
                time.sleep(1)
                response = requests.get(uri, params=params)
                assert response.status_code == 200
                posts = json.loads(response.content)[
                    "data"
                ]  # json.loads(json string) => python dict.

                project_meta = (
                    self.project_submission
                    if uri == self.endpoint["submission"]
                    else self.project_comment
                )
                project_meta = (
                    self.project_removed_comment if removed == True else project_meta
                )
                posts = list(
                    map(project_meta, posts)
                )  # List of dicts, where each dict = info for each post.
                posts = self._update_votes(posts)
                return posts

            except Exception as e:
                logger.error(e)
                time.sleep(1)
                trials += 1
        logger.error("Failed to retrieve posts.")
        return -1

    def _update_votes(self, posts):
        def fullname(post):
            if post["_type"] == "submission":
                return "t3_" + post["_id"]
            else:
                return "t1_" + post["_id"]

        post_ids = [fullname(post) for post in posts]
        fullname2votes = {res.id: res.score for res in self.reddit.info(post_ids)}

        for i in range(len(posts)):
            score = fullname2votes.get(posts[i]["_id"], 0)
            posts[i]["votes"] = score

        return posts

    @staticmethod
    def project_submission(post):
        return {
            "author": post["author"],
            "body": post.get("selftext", ""),
            "created_utc": datetime.fromtimestamp(post["created_utc"], tz=timezone.utc),
            "full_link": post["full_link"],
            "_id": post["id"],
            "subreddit": post["subreddit"],
            "title": post["title"],
            "_type": "submission",
            "domain": post["domain"],
            "url": post["url"],
        }

    @staticmethod
    def project_comment(post):
        return {
            "author": post["author"],
            "body": post.get("body", ""),
            "created_utc": datetime.fromtimestamp(post["created_utc"], tz=timezone.utc),
            "full_link": "https://www.reddit.com" + post["permalink"],
            "_id": post["id"],
            "subreddit": post["subreddit"],
            # 'link_id': post['link_id'][3:]  # link_id always starts with 't3_'--> id of a submission that this comment is linked to.
            "title": "",
            "_type": "comment",
        }

    @staticmethod
    def project_removed_comment(post):
        return {
            "author": post["author"],
            "author": post["author"],
            "body": post.get("body", ""),
            "created_utc": datetime.fromtimestamp(post["created_utc"], tz=timezone.utc),
            "full_link": "https://www.reddit.com" + post["permalink"],
            "_id": post["id"],
            "subreddit": post["subreddit"],
            # 'link_id': post['link_id'][3:]  # link_id always starts with 't3_'--> id of a submission that this comment is linked to.
            "title": "",
            "_type": "spam_comment",
        }

    def test_normal(self, ids, profile):
        """get comments with ids using pushshift
        & save them into database of a user.
        """
        try:
            with open(
                os.path.join(self.script_dir, "test_data/cached/normal_cache.json"), "r"
            ) as f:
                print("normal")
                normal_comments = json.load(f)
                for comment in normal_comments:
                    created_utc = datetime.fromtimestamp(
                        comment.pop("created_utc"), tz=timezone.utc
                    )
                    comment = {"created_utc": created_utc, **comment}
                    obj, created = Post.objects.update_or_create(**comment)
                    obj.profile_set.add(profile)
        except IOError:
            print("no normal_cache.json file")
            save_normal = []
            for i in range(0, len(ids), 100):
                batch = ids[i : i + 100]
                params = {"ids": ",".join(batch)}
                comments = self._get_reddit_posts(self.endpoint["comment"], params)
                for comment in comments:
                    votes = comment.pop("votes")
                    created_utc_timestamp = comment.pop("created_utc").timestamp()
                    save_normal.append(
                        {
                            "votes": votes,
                            "created_utc": created_utc_timestamp,
                            **comment,
                        }
                    )
            with open(
                os.path.join(self.script_dir, "test_data/cached/normal_cache.json"), "w"
            ) as f:
                print(save_normal)
                json.dump(save_normal, f, indent=2)

    def test_removed(self, removed_comments, profile):
        try:
            with open(
                os.path.join(self.script_dir, "test_data/cached/removed_cache.json"),
                "r",
            ) as f:
                print("test_removed")
                removed_comments = json.load(f)
                for comment in removed_comments:
                    created_utc = datetime.fromtimestamp(
                        comment.pop("created_utc"), tz=timezone.utc
                    )
                    comment = {"created_utc": created_utc, **comment}
                    obj, created = Post.objects.update_or_create(**comment)
                    obj.profile_set.add(profile)
        except IOError:
            print("no removed_cache.json file")
            save_removed = []
            for i in range(0, len(removed_comments), 100):
                batch = removed_comments[i : i + 100]
                params = {
                    "ids": ",".join(list(map(lambda comment: comment["id"], batch)))
                }
                comments = self._get_reddit_posts(
                    self.endpoint["comment"], params, removed=True
                )
                for index, comment in enumerate(comments):
                    author = comment.pop("author")
                    author = batch[index]["author"] if author == "[deleted]" else author
                    body = comment.pop("body")
                    body = batch[index]["body"] if body == "[removed]" else body
                    created_utc_timestamp = comment.pop("created_utc").timestamp()
                    save_removed.append(
                        {
                            "author": author,
                            "body": body,
                            "created_utc": created_utc_timestamp,
                            **comment,
                        }
                    )
            with open(
                os.path.join(self.script_dir, "test_data/cached/removed_cache.json"),
                "w",
            ) as f:
                json.dump(save_removed, f, indent=2)

    def test_run(self, normal_ids, removed_comments, profile):
        self.test_normal(normal_ids, profile)
        self.test_removed(removed_comments, profile)

    def run(self, **kwargs):
        """Get posts (submissions, comments) from Reddit using pushshift
        & save them into database.

        Returns:
            bool: True if succeed False otherwise.
        """
        # self._size_limit_test()
        stat = {"tot": 0, "submission": 0, "comment": 0}
        post_type = kwargs.get("post_type")
        max_size = kwargs["max_size"]
        if post_type == "all":
            post_types = ["submission", "comment"]
        else:
            post_types = [post_type]
        params = {
            "subreddit": kwargs["subreddit"],
            "after": kwargs["after"],
            "before": kwargs["before"],
            "size": self.request_size,
        }
        profile = kwargs["profile"]

        for post_type in post_types:
            logger.info(f"Crawl {post_type}")
            n = self.request_size
            term = kwargs["before"] - kwargs["after"]
            params["after"] = kwargs["after"]

            while n == self.request_size or n == self.request_size - 1:
                logger.info(
                    f'Querying starting from {datetime.fromtimestamp(params["after"], tz=timezone.utc)}'
                )
                logger.info(
                    f'{post_type} : {round((params["after"]-kwargs["after"])/term*100,2)}%'
                )
                posts = self._get_reddit_posts(self.endpoint[post_type], params)
                if posts == -1:
                    return False

                logger.info(f"Retrieved {len(posts)} {post_type}s.")
                for post in posts:
                    votes = post.pop("votes")
                    obj, created = Post.objects.update_or_create(
                        {"votes": votes}, **post
                    )

                    if profile is not None:
                        obj.profile_set.add(profile)
                    if created:
                        stat[post_type] += 1
                        stat["tot"] += 1
                        if max_size is not None and stat["tot"] >= max_size:
                            logger.info(
                                f"Finished: Number of newly inserted posts: {stat}"
                            )
                            return True

                # For the next loop.
                n = len(posts)
                if len(posts) != 0:
                    params["after"] = int(
                        datetime.timestamp(posts[-1]["created_utc"])
                    )  # Might skip some posts.
                logger.info(f"Iteration: Number of newly inserted posts: {stat}")
            logger.info(
                f'Last data time is {datetime.fromtimestamp(params["after"], tz=timezone.utc)}'
            )

        logger.info(f"Finished: Number of newly inserted posts: {stat}")
        return True
