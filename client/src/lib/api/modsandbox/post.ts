import axios from 'axios';
import moment from 'moment';
import { Filtered, PostType, SortType } from '../../../modules/post/slice';

//amazon ec2
// axios.defaults.baseURL = 'http://3.34.192.145:8080';
//kixlab2
axios.defaults.baseURL = 'http://143.248.48.96:8887';
//kixlab3
// axios.defaults.baseURL = 'http://143.248.48.96:9888';

export async function getPostsAPI(
  token: string | null,
  postType: PostType,
  postSortType: SortType,
  filtered: Filtered,
  page: number,
  userImported: boolean,
  search: string,
) {
  const response = await axios
    .get<PaginatedPostResponse>('/post/', {
      params: {
        post_type: postType,
        sort: postSortType,
        filtered,
        page,
        is_private: userImported,
        search,
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
      .get<PaginatedSpamResponse>('/spam/', {
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
    .get<PaginatedSpamResponse>('/spam/', {
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
  user_imported: boolean;
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
  const response = await axios.post('/post/crawl/', values, {
    headers: { Authorization: `Token ${token}` },
  });

  return response.statusText;
}

export async function importSpamPostsAPI(
  token: string,
  values: ImportSpamQuery,
) {
  const response = await axios.post('/spam/crawl/', values, {
    headers: { Authorization: `Token ${token}` },
  });

  return response.statusText;
}

export async function importTestDataAPI(token: string) {
  const response = await axios.post(
    '/post/import_test_data/',
    {},
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.statusText;
}

export async function deletePostsAPI(token: string, ids: number[]) {
  const response = await axios.post(
    '/post/deletes/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function deleteSpamsAPI(token: string, ids: number[]) {
  const response = await axios.post(
    '/spam/deletes/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function deleteAllPostsAPI(token: string) {
  const response = await axios.post('/post/delete_all/', null, {
    headers: { Authorization: `Token ${token}` },
  });

  return response.statusText;
}

export async function deleteAllSpamsAPI(token: string) {
  const response = await axios.post('/spam/delete_all/', null, {
    headers: { Authorization: `Token ${token}` },
  });

  return response.statusText;
}

export async function movePostsAPI(token: string, ids: number[]) {
  const response = await axios.post(
    '/post/moves/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function moveSpamsAPI(token: string, ids: number[]) {
  const response = await axios.post(
    '/spam/moves/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function applySeedsAPI(token: string, ids: string[]) {
  const response = await axios.post(
    '/post/apply_seeds/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function applySeedAPI(token: string, seed: string) {
  const response = await axios.post(
    '/post/apply_seed/',
    { seed },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.status;
}

export async function wordVariationAPI(token: string, keyword: string) {
  const response = await axios.post<Variation[]>(
    '/post/word_variation/',
    { keyword },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.data;
}

export async function wordFrequencyAPI(token: string, ids: number[]) {
  const response = await axios.post<Frequency[]>(
    '/spam/word_frequency/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.data;
}

export async function addPostAPI(token: string, newPost: NewPost) {
  const response = await axios.post<Post>(
    '/post/',
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

export async function addTestPostAPI(token: string, newPost: NewPost) {
  const response = await axios.post<Post>(
    '/post/add_test/',
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
    '/spam/',
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

export async function selectPostsAPI(token: string, type: SelectType) {
  const response = await axios
    .get<string[]>('/post/ids/', {
      params: {
        type,
      },
      headers: { Authorization: `Token ${token}` },
    })
    .catch((error) => {
      return error.message;
    });

  return response.data;
}

export async function selectSpamsAPI(token: string, type: SelectType) {
  const response = await axios
    .get<string[]>('/spam/ids/', {
      params: {
        type,
      },
      headers: { Authorization: `Token ${token}` },
    })
    .catch((error) => {
      return error.message;
    });

  return response.data;
}

export interface Variation {
  word: string;
  post_freq: number;
  // spam_freq: number;
  sim: number;
}

export interface Frequency {
  word: string;
  freq: number;
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
  id: number;
  _id: string;
  _type: 'comment' | 'submission';
  author: string;
  body: string;
  created_utc: string;
  full_link: string;
  subreddit: string;
  title: string;
  matching_rules: number[];
  domain: string;
  url: string;
  votes: number;
  similarity: number;
};

export type NewPost = {
  _id: string;
  _type: 'comment' | 'submission' | 'spam_submission' | 'spam_comment';
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
  id: number;
  _id: string;
  _type: SpamType;
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
  similarity: number;
};

export type SpamType =
  | 'spam_comment'
  | 'spam_submission'
  | 'reports_comment'
  | 'reports_submission';

export type SelectType = 'all' | 'filtered' | 'unfiltered';
