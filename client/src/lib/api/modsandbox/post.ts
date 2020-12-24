import axios from 'axios';
import { Filtered, PostType, SortType, SpamType } from '../../../modules/post/slice';

export async function getPostsAPI(
  token: string | null,
  postType: PostType,
  postSortType: SortType,
  filtered: Filtered,
  page: number,
) {
  const response = await axios
    .get<PaginatedPostResponse>('http://localhost:8000/post/', {
      params: {
        post_type: postType,
        sort: postSortType,
        filtered, 
        page,
      },
      headers: { Authorization: `Token ${token}` },
    })
    .catch((error) => {
      return error.message;
    });

  return response.data;
}

export async function getSpamsAPI(
  token: string | null,
  spamType: SpamType,
  spamSortType: SortType,
  filtered: Filtered,
  page: number,
) {
  const response = await axios
    .get<PaginatedSpamResponse>('http://localhost:8000/spam/', {
      params: {
        post_type: spamType,
        sort: spamSortType,
        filtered, 
        page,
      },
      headers: { Authorization: `Token ${token}` },
    })
    .catch((error) => {
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

export async function importSubredditPostsAPI(
  token: string,
  values: ImportQuery,
) {
  const response = await axios.post(
    'http://localhost:8000/post/crawl/',
    values,
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.statusText;
}

export async function deleteAllPostsAPI(token: string) {
  const response = await axios.post(
    'http://localhost:8000/post/delete_all/',
    null,
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.statusText;
}

export interface PaginatedPostResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: Post[];
}

export interface PaginatedSpamResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: Spam[];
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
};

export type Spam = {
  _id: string;
  _type: 'spam_comment' | 'spam_submission';
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  title: string;
  matching_rules: number[];
  banned_by: string;
  banned_at_utc: string;
};
