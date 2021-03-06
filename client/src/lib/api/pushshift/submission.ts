import axios from 'axios';

export async function getPostsAPI(subredditName: string) {
  const response = await axios.get<{ data: Submission[] }>(
    // `https://api.pushshift.io/reddit/search/submission/?subreddit=${subredditName}`,
    'http://localhost:4000/posts',
  );
  return response.data;
}

export interface Submission {
  type: 'submission';
  author: string;
  created_utc: number;
  full_link: string;
  id: string;
  permalink: string;
  selftext: string;
  subreddit: string;
  title: string;
  filter_id: string[];
}
