import axios from 'axios';

export async function getCommentsAPI(submissionId: string) {
  const response = await axios.get<{ data: Comment[] }>(
    `https://api.pushshift.io/reddit/search/comment/?link_id=${submissionId}`,
  );
  return response.data.data;
}

export interface Comment {
  author:      string;
  body:        string;
  created_utc: number;
  id:          string;
  link_id:     string;
  permalink:   string;
  subreddit:   string;
}