import json
from .zreader import Zreader
from .models import Post
from datetime import datetime, timezone

class FileHandler():
    def __init__(self, file_path):
        self.file_path = file_path
    
    @staticmethod
    def project_submission(post):
        return {
            'author': post['author'],
            'body': post.get('selftext', ''),
            'created_utc': datetime.fromtimestamp(post['created_utc'], tz=timezone.utc),
            'full_link': "https://www.reddit.com"+post['permalink'],
            '_id': post['id'],
            'subreddit': post['subreddit'],
            'title': post['title'],
            '_type': 'submission',
            'domain': post['domain'],
            'url': post['url'],
            'is_private': False,
        }

    def run(self):
        # Adjust chunk_size as necessary -- defaults to 16,384 if not specified
        reader = Zreader(self.file_path)
        number = 0

        # Read each line from the reader
        for line in reader.readlines():
            post = json.loads(line)
            submission = self.project_submission(post)
            obj, created = Post.objects.update_or_create(**submission)
            if created:
                number = number + 1
                if (number % 1000 == 0):
                    print(number)
        print(number)
                    
            # with dctx.stream_reader(fh) as reader:
            #     previous_line = ""
            #     for j in range(2):
            #         chunk = reader.read(65536)
            #         if not chunk:
            #             break
            #         string_data = chunk.decode('utf-8')
            #         lines = string_data.split("\n")
            #         for i, line in enumerate(lines[:-1]):
            #             if i == 0:
            #                 line = previous_line + line
            #             print(j, i, line)
            #             # obj = json.loads(line)

            #             # print(obj["author"])


