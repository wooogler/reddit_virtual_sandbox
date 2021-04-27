export interface IUser {
  nickname: string;
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

