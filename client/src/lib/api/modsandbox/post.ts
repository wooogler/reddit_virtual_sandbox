import axios from 'axios';

export async function getAllPostsAPI() {
  const submissionResponse = await axios.get<Submission[]>(
    'http://127.0.0.1:8000/data',
    {
      params: {
        post_type: 'submission',
      }
    }
  );
  const commentResponse = await axios.get<Comment[]>(
    'http://localhost:8000/data',
    {
      params: {
        post_type: 'comment',
      }
    }
  )
  const response = {data: [...submissionResponse.data, ...commentResponse.data]}
  
  return response.data;
}

export function isSubmission(post: Submission | Comment): post is Submission {
  return (post as Submission).title !== undefined;
}

export interface Comment {
  submission: string;
  _id: string;
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  matching_rules: null | string[];
}

export interface Submission {
  _id: string;
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  title: string;
  matching_rules: null | string[];
}