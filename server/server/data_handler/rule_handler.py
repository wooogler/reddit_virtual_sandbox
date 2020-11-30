import logging

from .models import Submission, Comment

logger = logging.getLogger(__name__)

class RuleHandler():
    def apply_rules(self, rules):
        """Apply rules to each post in database.
        
        Returns:
            bool: True if success False otherwise.
        """
        submissions = Submission.objects.all()
        comments = Comment.objects.all()

        for post in submissions:
            matching_rules = self._get_matching_rules(post, rules)
            self._update_status(post, matching_rules)
        for post in comments:
            matching_rules = self._get_matching_rules(post, rules)
            self._update_status(post, matching_rules)
        logger.info('Updated matching_rules column in database.')
        return True

    def reset_rules(self):
        """Reset matching_rules columns."""
        submissions = Submission.objects.all()
        comments = Comment.objects.all()

        for post in submissions:
            self._update_status(post, None)
        for post in comments:
            self._update_status(post, None)
        logger.info('Reset matching_rules column.')

    @staticmethod
    def _update_status(post, matching_rules):
        post.matching_rules = matching_rules
        post.save()
    
    def _get_matching_rules(self, post, rules):
        """
        Args:
            post: Submission or Comment Instance.
            rules (list(dict)): Moderation rules.
        
        Returns:
            list((int, int)) or None: List of matching rules (rule_id, line_id) for the given post.
        """
        matching_rules = set()
        for rule in rules:
            if self._is_matching(post, rule):
                matching_rules.add((rule['ruleId'], rule['lineId']))
        matching_rules = list(matching_rules)
        if matching_rules:
            logger.info(f'Matching rules for post ({post._id}): {matching_rules}')
            return matching_rules
        return None
        
    @staticmethod
    def _is_matching(post, rule):
        """Check if post matches the rule.
        
        Returns:
            bool: True if matched by the rule, False otherwise.
        """
        check = rule['check']  # Target field to check.
        value = rule['value']
        modifier = rule['modifier']
        # TODO

        return True
