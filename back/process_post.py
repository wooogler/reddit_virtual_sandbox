import os
import json
from modsandbox.models import Post

with open(os.path.join(os.path.dirname(__file__),
                       'test_data/submission_cscareerquestions_may_1st_labeled.json')) as test_json:
    test_posts = json.load(test_json)
    test_json.close()

with open(os.path.join(os.path.dirname(__file__),
                       'test_data/submission_cscareerquestions_may_2nd_labeled.json')) as eval_json:
    eval_posts = json.load(eval_json)
    eval_json.close()

all_posts = Post.objects.all()
print(all_posts.count())
