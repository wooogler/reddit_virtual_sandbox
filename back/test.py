import praw
import os
from psaw import PushshiftAPI

reddit = praw.Reddit(
    client_id="BSuv858saoRX6Q",
    client_secret="si5WWPBCyfnfdknA7qRR7bTKFD7Z6g",
    refresh_token="43646009674-kHjXdw-_rtmw4Yv2tOaCYfLt8Phq1w",
    user_agent="modsandbox by /u/leesang627"
)

api = PushshiftAPI(reddit)

submissions = api.search_submissions(subreddit='animemes', id='i2mn3g', filter=['id', 'created_utc'])
for x in submissions:
    print(x.upvote_ratio)
