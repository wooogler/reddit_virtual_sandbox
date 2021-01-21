import axios from 'axios';
import moment from 'moment';
import { Filtered, PostType, SortType } from '../../../modules/post/slice';

export async function getPostsAPI(
  token: string | null,
  postType: PostType,
  postSortType: SortType,
  filtered: Filtered,
  page: number,
  userImported: boolean,
) {
  const response = await axios
    .get<PaginatedPostResponse>('http://localhost:8000/post/', {
      params: {
        post_type: postType,
        sort: postSortType,
        filtered,
        page,
        is_private: userImported,
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
  userImported: boolean,
) {
  if (userImported) {
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
  const response = await axios
    .get<PaginatedSpamResponse>('http://localhost:8000/spam/', {
      params: {
        post_type: spamType,
        sort: spamSortType,
        filtered,
        page,
      },
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
  subreddit_name: string | undefined;
  mod_type: string;
  removal_reason: string;
  community_rule: string;
  moderator_name: string;
  reported_by: string;
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

export async function deletePostsAPI(token: string, ids: string[]) {
  const response = await axios.post(
    'http://localhost:8000/post/deletes/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function deleteSpamsAPI(token: string, ids: string[]) {
  const response = await axios.post(
    'http://localhost:8000/spam/deletes/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
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

export async function movePostsAPI(token: string, ids: string[]) {
  const response = await axios.post(
    'http://localhost:8000/post/moves/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function moveSpamsAPI(token: string, ids: string[]) {
  const response = await axios.post(
    'http://localhost:8000/spam/moves/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function addPostAPI(token: string, newPost: NewPost) {
  const response = await axios.post<Post>(
    'http://localhost:8000/post/',
    {
      ...newPost,
      created_utc: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.data;
}

export async function addSpamAPI(
  token: string,
  newSpam: NewSpam,
  username: string | undefined,
) {
  const now = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
  const response = await axios.post<Spam>(
    'http://localhost:8000/spam/',
    {
      ...newSpam,
      created_utc: now,
      banned_at_utc: now,
      banned_by: username ? username : 'fake_user',
    },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

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
  domain: string;
  url: string;
};

export type NewPost = {
  _id: string;
  _type: 'comment' | 'submission';
  author: string | undefined;
  body: string;
  title: string;
  domain: string;
};

export type NewSpam = {
  _id: string;
  _type: 'spam_comment' | 'spam_submission';
  author: string | undefined;
  body: string;
  title: string;
  domain: string;
};

export type Spam = {
  _id: string;
  _type: SpamType
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  title: string;
  matching_rules: number[];
  banned_by: string | null;
  banned_at_utc: string | null;
  mod_reason_title: string | null;
  mod_reports: [string, string][];
  user_reports: [string, number][];
  domain: string;
  url: string;
};

export type SpamType =
  | 'spam_comment'
  | 'spam_submission'
  | 'reports_comment'
  | 'reports_submission';
