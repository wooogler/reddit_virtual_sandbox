import axios from 'axios';
import { Filtered, PostType, SortType} from '../../../modules/post/slice';

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
  spamType: PostType,
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

export interface ImportPostQuery {
  subreddit: string;
  after: number;
  before: number;
  post_type: string;
  max_size: number | null;
}

export interface ImportSpamQuery {
  subreddit_name: string;
  mod_type: string;
}

export async function importSubredditPostsAPI(
  token: string,
  values: ImportPostQuery,
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

export async function importSpamPostsAPI(
  token: string,
  values: ImportSpamQuery,
) {
  const response = await axios.post(
    'http://localhost:8000/spam/crawl/',
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

export async function deleteAllSpamsAPI(token: string) {
  const response = await axios.post(
    'http://localhost:8000/spam/delete_all/',
    null,
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.statusText;
}

export async function getModSubreddits(token: string) {
  const response = await axios.get<string[]>('http://localhost:8000/mod_subreddits',{
    headers: { Authorization: `Token ${token}` },
  })

  return response.data;
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
  ups: number;
  downs: number;
};

export type Spam = {
  _id: string;
  _type: 'spam_comment' | 'spam_submission' | 'reports_comment' | 'reports_submission';
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  title: string;
  matching_rules: number[];
  banned_by: string | null;
  banned_at_utc: string | null;
  mod_reports: [string, string][];
  user_reports: [string, number][];
};
