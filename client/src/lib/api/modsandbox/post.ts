import axios from 'axios';
import { PostType, SortType } from '../../../modules/post/slice';

export async function getAllPostsAPI(
  token: string | null,
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

export interface ImportQuery {
  subreddit: string;
  after: number;
  before: number;
  post_type: string;
  max_size: number | null;
}

export async function importSubredditPostsAPI(token: string, values: ImportQuery) {
  const response = await axios.post('http://localhost:8000/post/crawl/', values, {
    headers: { Authorization: `Token ${token}` },
  })

  return response.statusText;
}

export async function deleteAllPostsAPI(token: string) {
  const response = await axios.post('http://localhost:8000/post/delete_all/', null, {
    headers: { Authorization: `Token ${token}` },
  })

  return response.statusText;
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
