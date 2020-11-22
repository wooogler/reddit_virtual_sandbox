import axios from 'axios';

export async function getSubmissionsAPI(subredditName: string) {
  const response = await axios.get<{ data: Submission[] }>(
    // `https://api.pushshift.io/reddit/search/submission/?subreddit=${subredditName}`,
    'http://localhost:4000/submissions',
  );
  return response.data;
}

export interface Submission {
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
