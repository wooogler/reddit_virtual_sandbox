import praw
import re

import yaml

reddit = praw.Reddit(
    client_id="BSuv858saoRX6Q",
    client_secret="si5WWPBCyfnfdknA7qRR7bTKFD7Z6g",
    user_agent="modsandbox by /u/leesang627",
)

_operator_regex = r"(==?|<|>)"


def author(code):
    values = yaml.safe_load(code)
    author = values.pop("author", None)
    if not isinstance(author, dict):
        # if they just specified string(s) for author
        # that's the same as checking against name
        if isinstance(author, list):
            author = {"name": author}
        else:
            author = {}
    print(author)


author("author: \n    account_age: '> 7 years'")
