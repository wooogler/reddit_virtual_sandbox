import json
import os
from types import SimpleNamespace
from modsandbox.models import User


def to_simple_namespace(posts):
    return ([
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
                'rule_1': post['rule_1'] if 'rule_1' in post else 0,
                'rule_2': post['rule_2'] if 'rule_2' in post else 0,
            })
        for post in posts])


with open(os.path.join(os.path.dirname(__file__),
                       'test_data/submission_cscareerquestions_may_1st_labeled.json')) as test_json:
    test_posts = json.load(test_json)

    test_json.close()

with open(os.path.join(os.path.dirname(__file__),
                       'test_data/submission_cscareerquestions_may_2nd_labeled.json')) as eval_json:
    eval_posts = json.load(eval_json)
    eval_json.close()

super_user = User.objects.create(username='superuser')
print(super_user)
