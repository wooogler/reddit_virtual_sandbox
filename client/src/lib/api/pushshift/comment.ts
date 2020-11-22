import axios from 'axios';

export async function getCommentsAPI(submissionId: string) {
  const response = await axios.get<{ data: Comment[] }>(
    // `https://api.pushshift.io/reddit/search/comment/?link_id=${submissionId}`,
    'http://localhost:4000/submissions',
  );
  return response.data.data;
}

export interface Comment {
  type: 'comment';
  author: string;
  body: string;
  created_utc: number;
  id: string;
  link_id: string;
  permalink: string;
  subreddit: string;
  filter_id: string[];
}
