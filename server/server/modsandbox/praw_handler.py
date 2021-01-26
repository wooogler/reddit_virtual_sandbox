import os
import json
import logging
from datetime import datetime, timezone

import praw

from .models import Post


logger = logging.getLogger(__name__)


class PrawHandler:
    def __init__(self, reddit_token):
        self.reddit = praw.Reddit(
            client_id=os.environ.get("client_id"),
            client_secret=os.environ.get("client_secret"),
            refresh_token=reddit_token,
            user_agent=os.environ.get("user_agent"),
        )

    @staticmethod
    def project_spam(spam):
        if isinstance(spam, praw.models.Submission):
            return {
                "author": spam.author.name,
                "body": spam.selftext,
                "created_utc": datetime.fromtimestamp(
                    spam.created_utc, tz=timezone.utc
                ),
                "full_link": "https://www.reddit.com" + spam.permalink,
                "_id": spam.id,
                "subreddit": spam.subreddit.display_name,
                "title": spam.title,
                "_type": "spam_submission",
                "banned_by": spam.banned_by,
                "banned_at_utc": datetime.fromtimestamp(
                    spam.banned_at_utc, tz=timezone.utc
                ),
                "mod_reason_title": spam.mod_reason_title,
                "user_reports": spam.user_reports,
                "mod_reports": spam.mod_reports,
                "votes": spam.votes,
                "domain": spam.domain,
                "url": spam.url,
            }

        return {
            "author": spam.author.name,
            "body": spam.body,
            "created_utc": datetime.fromtimestamp(spam.created_utc, tz=timezone.utc),
            "full_link": "https://www.reddit.com" + spam.permalink,
            "_id": spam.id,
            "subreddit": spam.subreddit.display_name,
            "title": "",
            "_type": "spam_comment",
            "banned_by": spam.banned_by,
            "banned_at_utc": datetime.fromtimestamp(
                spam.banned_at_utc, tz=timezone.utc
            ),
            "mod_reason_title": spam.mod_reason_title,
            "user_reports": spam.user_reports,
            "mod_reports": spam.mod_reports,
            "votes": spam.votes,
        }

    @staticmethod
    def project_reports(reports):
        if isinstance(reports, praw.models.Submission):
            return {
                "author": reports.author.name,
                "body": reports.selftext,
                "created_utc": datetime.fromtimestamp(
                    reports.created_utc, tz=timezone.utc
                ),
                "full_link": "https://www.reddit.com" + reports.permalink,
                "_id": reports.id,
                "subreddit": reports.subreddit.display_name,
                "title": reports.title,
                "_type": "reports_submission",
                "user_reports": reports.user_reports,
                "mod_reports": reports.mod_reports,
                "votes": reports.votes,
                "domain": reports.domain,
                "url": reports.url,
            }

        return {
            "author": reports.author.name,
            "body": reports.body,
            "created_utc": datetime.fromtimestamp(reports.created_utc, tz=timezone.utc),
            "full_link": "https://www.reddit.com" + reports.permalink,
            "_id": reports.id,
            "subreddit": reports.subreddit.display_name,
            "title": "",
            "_type": "reports_comment",
            "user_reports": reports.user_reports,
            "mod_reports": reports.mod_reports,
            "votes": reports.votes
        }
    
    def project_modqueue(self, modqueue):
        if modqueue.banned_by:
            return self.project_spam(modqueue)
        return self.project_reports(modqueue)

    def _get_spam_posts(self, subreddit_name):
        spams = self.reddit.subreddit(subreddit_name).mod.spam(limit=None)
        spams = list(map(self.project_spam, spams))
        return spams

    def _get_reports_posts(self, subreddit_name):
        reports = self.reddit.subreddit(subreddit_name).mod.reports(limit=None)
        reports = list(map(self.project_reports, reports))
        return reports

    def _get_modqueue_posts(self, subreddit_name):
        modqueue = self.reddit.subreddit(subreddit_name).mod.modqueue(limit=None)
        modqueue = list(map(self.project_modqueue, modqueue))
        return modqueue

    def run(self, **kwargs):
        stat = {"tot": 0, "submission": 0, "comment": 0}
        profile = kwargs["profile"]
        subreddit_name = kwargs['subreddit_name']
        mod_type = kwargs['mod_type']
        removal_reason = kwargs['removal_reason']
        community_rule = kwargs['community_rule']
        moderator_name = kwargs['moderator_name']
        reported_by = kwargs['reported_by']
        if mod_type == 'spam':
            spams = self._get_spam_posts(subreddit_name)
            print('removal_reason: ', removal_reason)
            if removal_reason != 'all':
                spams = list(filter(lambda spam: spam["mod_reason_title"] == removal_reason, spams))
            if moderator_name != 'all':
                spams = list(filter(lambda spam: spam["banned_by"] == moderator_name, spams))
        elif mod_type =='reports':
            spams = self._get_reports_posts(subreddit_name)
            if reported_by == 'mod':
                if moderator_name != 'all':
                    spams = list(filter(lambda spam: moderator_name in list(map(lambda report: report[1], spam["mod_reports"])), spams))
            elif reported_by=='user':
                if community_rule != 'all':
                    spams = list(filter(lambda spam: community_rule in list(map(lambda report: report[0], spam["user_reports"])), spams))
            
        elif mod_type =='modqueue':
            spams = self._get_modqueue_posts(subreddit_name)
        for spam in spams:
            obj, created = Post.objects.get_or_create(**spam)
            if profile is not None:
                obj.profile_set.add(profile)
            if created:
                stat["tot"] += 1
                if spam["_type"] == "spam_submission":
                    stat["submission"] += 1
                else:
                    stat["comment"] += 1

        logger.info(f"Number of newly inserted spams: {stat}")
        return True

    @staticmethod
    def project_mod_subreddit(mod_subreddit):
        return mod_subreddit.display_name

    def get_mod_subreddits(self):
        return list(
            map(self.project_mod_subreddit, self.reddit.user.contributor_subreddits())
        )

    @staticmethod
    def project_removal_reasons(reason):
        return reason.title

    def get_removal_reasons(self, subreddit_name):
        return list(
            map(self.project_removal_reasons, self.reddit.subreddit(subreddit_name).mod.removal_reasons)
        )

    @staticmethod
    def project_community_rules(reason):
        return reason.short_name

    def get_community_rules(self, subreddit_name):
        return list(
            map(self.project_community_rules, self.reddit.subreddit(subreddit_name).rules)
        )

    @staticmethod
    def project_moderators(mod):
        return mod.name
    
    def get_moderators(self, subreddit_name):
        return list(
            map(self.project_moderators, self.reddit.subreddit(subreddit_name).moderator())
        )
