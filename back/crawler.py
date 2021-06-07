import praw
import typer
from datetime import datetime
from psaw import PushshiftAPI
import json


def main(subreddit: str, after: datetime, before: datetime = typer.Argument(datetime.now()),
         file_name: typer.FileTextWrite = typer.Argument("output.json"),
         type: str = typer.Option("submission", help='type submission or comment')):
    reddit = praw.Reddit(
        client_id="BSuv858saoRX6Q",
        client_secret="si5WWPBCyfnfdknA7qRR7bTKFD7Z6g",
        user_agent="modsandbox by /u/leesang627",
    )
    api = PushshiftAPI(reddit)
    if type == 'submission':
        submissions = api.search_submissions(subreddit=subreddit, after=after, before=before)
        submissions_list = submission_to_list(submissions)
        file_name.write(json.dumps(submissions_list, indent=4))
        typer.echo(f'Submissions saved! total: {len(submissions_list)}')

    elif type == 'comment':
        comments = api.search_comments(subreddit=subreddit, after=after, before=before)
        comments_list = comment_to_list(comments)
        file_name.write(json.dumps(comments_list, indent=4))
        typer.echo(f'Comments saved! total: {len(comments_list)}')


def submission_to_list(submissions):
    return [{"author": submission.author.name, "title": submission.title, "body": submission.selftext,
             "created_utc": submission.created_utc} for submission in submissions if
            submission.author and submission.selftext != '[removed]']


def comment_to_list(comments):
    return [{"author": comment.author.name, "title": comment.title, "body": comment.body,
             "created_utc": comment.created_utc} for comment in comments if
            comment.author and comment.body != '[removed]']


if __name__ == "__main__":
    typer.run(main)
