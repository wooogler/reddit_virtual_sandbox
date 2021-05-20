export interface IUser {
  username: string;
  reddit_token: string;
}

export interface IPost {
  id: string;
  from: 'Subreddit' | 'Spam' | 'report';
  title: string;
  body: string;
  author: string;
  createdAt: Date;
  isFiltered: boolean;
}

export interface IRule {
  field: string;
  modifiers: string[];
  value: string;
}

export interface PaginatedPosts {
  count: number;
  next: any;
  previous: any;
  results: IPost[];
}
