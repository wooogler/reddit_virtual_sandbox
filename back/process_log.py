import json
import os
from types import SimpleNamespace
from modsandbox.models import User, Post, Log, Config
from modsandbox.post_handler import create_test_posts
from modsandbox.rule_handler import apply_dummy_config
from rest_framework import exceptions


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


# with open('modsandbox/test_data/submission_cscareerquestions_may_1st_labeled.json') as test_json:
#     test_posts_raw = json.load(test_json)
#     test_json.close()
#
# with open('modsandbox/test_data/submission_cscareerquestions_may_2nd_labeled.json') as eval_json:
#     eval_posts_raw = json.load(eval_json)
#     eval_json.close()

(super_user, _) = User.objects.get_or_create(username='superuser')

# create_test_posts(to_simple_namespace(test_posts_raw), super_user, 'normal')
# create_test_posts(to_simple_namespace(eval_posts_raw), super_user, 'target')

test_posts = Post.objects.filter(user=super_user, place='normal')
eval_posts = Post.objects.filter(user=super_user, place='target')

autosave_logs = Log.objects.filter(info='autosave config')
print('autosave number: ', autosave_logs.count())

for (count, log) in enumerate(autosave_logs):
    print(count)
    test_config = Config.objects.create(user=super_user, code=log.content, task='test')
    eval_config = Config.objects.create(user=super_user, code=log.content, task='eval')
    try:
        test_config = apply_dummy_config(test_config, test_posts, False)
        eval_config = apply_dummy_config(eval_config, eval_posts, False)
    except exceptions.ParseError:
        continue
    if log.task.startswith('A'):
        log.test_tp = test_config.post_set.filter(place__in=['normal'], rule_1=1).count()
        log.test_fp = test_config.post_set.filter(place__in=['normal'], rule_1=0).count()
        log.test_fn = test_posts.filter(rule_1=1).count() - log.test_tp
        log.test_tn = test_posts.filter(rule_1=0).count() - log.test_fp
        log.eval_tp = eval_config.post_set.filter(place__in=['target'], rule_1=1).count()
        log.eval_fp = eval_config.post_set.filter(place__in=['target'], rule_1=0).count()
        log.eval_fn = eval_posts.filter(rule_1=1).count() - log.eval_tp
        log.eval_tn = eval_posts.filter(rule_1=0).count() - log.eval_fp
    elif log.task.startswith('B'):
        log.test_tp = test_config.post_set.filter(place__in=['normal'], rule_2=1).count()
        log.test_fp = test_config.post_set.filter(place__in=['normal'], rule_2=0).count()
        log.test_fn = test_posts.filter(rule_2=1).count() - log.test_tp
        log.test_tn = test_posts.filter(rule_2=0).count() - log.test_fp
        log.eval_tp = eval_config.post_set.filter(place__in=['target'], rule_2=1).count()
        log.eval_fp = eval_config.post_set.filter(place__in=['target'], rule_2=0).count()
        log.eval_fn = eval_posts.filter(rule_2=1).count() - log.eval_tp
        log.eval_tn = eval_posts.filter(rule_2=0).count() - log.eval_fp
    log.save()
