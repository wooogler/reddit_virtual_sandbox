import praw
import os

reddit = praw.Reddit(
    client_id="BSuv858saoRX6Q",
    client_secret="si5WWPBCyfnfdknA7qRR7bTKFD7Z6g",
    user_agent="modsandbox by /u/leesang627",
)

url = "https://www.reddit.com/r/funny/comments/3g1jfi/buttons/"
submission = reddit.submission(url=url)
for comment in submission.comments:
    print(vars(comment))
