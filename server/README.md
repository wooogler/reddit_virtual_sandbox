# reddit_virsual_sandbox

server


## How to run server locally
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

## Available API Interface

### POST /data/save_to_database/
- Description: Save posts to database. Posts have two types: Submission & Comment.
- Warning: It may "skip" some posts inside the designated time interval passed by the user. (it's implemented with this limitation to simplify the implementation considering the fact that pushshift.io returns 500 posts at maximum for one request... But if I get any better idea, I will definitely modify the implementation! Please let me know!)

- Example
    - Save submissions.
    ```bash
    curl -i -XPOST "http://127.0.0.1:8000/data/save_to_database/" -H "Content-Type: application/json" -d '{"subreddit": "Cooking", "start_time": "2020-10-10-00:00:30", "end_time": "2020-10-11-00:30:00"}'
    ```

    - Save comments (and their linked submissions as well.)
    ```bash
    curl -i -XPOST "http://127.0.0.1:8000/data/save_to_database/" -H "Content-Type: application/json" -d '{"subreddit": "Cooking", "start_time": "2020-10-11-00:00:30", "end_time": "2020-10-11-00:30:00", "post_type": "comment"}'
    ```
- If you are trying to save already saved posts, it will be skipped so it's ok if you run duplcate requests again and again.
