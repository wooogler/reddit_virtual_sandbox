export interface IUser {
  username: string;
  reddit_token: string;
}

export interface IPost {
  id: string;
  source: 'Subreddit' | 'Spam' | 'Report';
  place: 'normal' | 'target' | 'except';
  title: string;
  body: string;
  author: string;
  created_utc: Date;
  isFiltered: boolean;
}

export interface IRule {
  id: number;
  code: string;
  created_at: string;
}

export interface PaginatedPosts {
  count: number;
  nextPage: number;
  results: IPost[];
}
