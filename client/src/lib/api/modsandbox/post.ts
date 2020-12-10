import axios from 'axios';
import { PostType, SortType } from '../../../modules/post/slice';

export async function getAllPostsAPI(
  token: string,
  postType: PostType,
  sortType: SortType,
  page: number,
) {
  const response = await axios.get<PaginatedResponse>('http://localhost:8000/post', {
    params: {
      type: postType,
      sort: sortType,
      page,
    },
    headers: { Authorization: `Token ${token}` },
  }).catch((error) => {
    return error.message;
  });

  return response.data;
}

export interface PaginatedResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: Post[];
}

export type Post = {
  _id: string;
  _type: 'comment' | 'submission';
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  title: string;
  matching_rules: number[];
}
