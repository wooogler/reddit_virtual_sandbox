import os
import json
from modsandbox.models import Post

with open('modsandbox/test_data/submission_cscareerquestions_may_1st_labeled.json') as test_json:
    test_posts_raw = json.load(test_json)
    test_json.close()

with open('modsandbox/test_data/submission_cscareerquestions_may_2nd_labeled.json') as eval_json:
    eval_posts_raw = json.load(eval_json)
    eval_json.close()

rule_dict = {}
for item in test_posts_raw:
    rule_dict[item['id']] = item['rule_1']
for item in eval_posts_raw:
    rule_dict[item['id']] = item['rule_1']

all_posts = Post.objects.all()
for post in all_posts:
    if post.post_id in rule_dict:
        post.rule_1 = rule_dict[post.post_id]
        post.save()
