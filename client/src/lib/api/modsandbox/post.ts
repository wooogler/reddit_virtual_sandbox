import axios from 'axios';
import { PostType, SortType } from '../../../modules/post/slice';

export async function getAllPostsAPI(
  postType: PostType,
  sortType: SortType,
  page: number,
) {
  const response = await axios.get<Posts>('http://localhost:8000/data', {
    params: {
      post_type: postType,
      sort: sortType,
      page,
    },
  });

  // const response = await axios.get<Posts>('http://localhost:4000/posts');

  return response.data;
}

export function isSubmission(post: Submission | Comment): post is Submission {
  return (post as Submission).title !== undefined;
}

export type Posts = (Submission | Comment)[];

export interface Comment {
  submission: string;
  _id: string;
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  matching_rules: string[];
}

export interface Submission {
  _id: string;
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  title: string;
  matching_rules: string[];
}
