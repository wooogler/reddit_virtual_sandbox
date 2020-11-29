# reddit_virtual_sandbox

server


## 1. How to run server locally
```bash
# 1. Install required packages.
$ pip install -r requirements.txt

# 2. Set up database. (run these commands whenever you make change in database schema (models.py))
$ python manage.py makemigrations
$ python manage.py migrate

# 3. Run server.
$ python manage.py runserver

# (4. You can use this command to clean the database.)
$ python manage.py flush
```

## 2. Available API Interface
### 2-1. GET

| Endpoint                            | Description                                                  | Example |
| ----------------------------------- | ------------------------------------------------------------ | ------- |
| /data/, /data/?post_type=submission | Return all posts from submission database.                   |         |
| /data/?post_type=comment            | Return all posts from comment database.                      |         |
| /data/{id}                          | Return submission with the given id.                         |         |
| /data/{id}/?link_comments=true      | Return submission with the given id + all comments linked to that submission. |         |

### 2-2. POST

| Endpoint               | Description                                                  | Example                                                      |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| /data/save_to_database | Crawl posts (Submission or Comment) from Reddit & Save them to corresponding database. | [Save submissions.]<br />curl -i -XPOST "http://127.0.0.1:8000/data/save_to_database/" -H "Content-Type: application/json" -d '{"subreddit": "Cooking", "start_time": "2020-10-10-00:00:30", "end_time": "2020-10-11-00:30:00"}'<br /><br /><br />[Save comments. (and their linked submissions as well.)]<br />curl -i -XPOST "http://127.0.0.1:8000/data/save_to_database/" -H "Content-Type: application/json" -d '{"subreddit": "Cooking",  "start_time": "2020-10-11-00:00:30", "end_time": "2020-10-11-00:30:00", "post_type": "comment"}' |

#### 2-2-1. /data/save_to_database

- Warning: It may "skip" some posts inside the designated time interval passed by the user. (it's implemented with this limitation to simplify the implementation considering the fact that pushshift.io returns 500 posts at maximum for one request...But if I get any better idea, I will definitely modify the implementation! Please let me know!)

- If you are trying to save already saved posts, it will be skipped so it's ok if you run duplicate requests again and again.



## 3. Reddit Data
- Reference
  - https://github.com/pushshift/api/blob/master/README.md
  - https://reddit-api.readthedocs.io/en/latest/#
  - https://praw.readthedocs.io/en/v3.6.2/
  - https://medium.com/@pasdan/how-to-scrap-reddit-using-pushshift-io-via-python-a3ebcc9b83f4

- "Links start with t3_, comments start with t1_. So yeah, link_id will always start with t3_.
If the parent_id starts with t3_, or if it matches the link_id, then you know it's a top level comment."
([ref](https://www.reddit.com/r/pushshift/comments/ayvut7/how_do_you_link_the_comments_with_their/ei3smjp/))
