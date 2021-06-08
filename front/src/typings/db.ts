export interface IUser {
  username: string;
  reddit_token: string;
}

export interface IPost {
  id: string;
  post_id: string;
  source: 'Subreddit' | 'Spam' | 'Report';
  place: 'normal' | 'target' | 'except' | 'normal-target' | 'normal-except';
  post_type: 'Submission' | 'Comment';
  title: string;
  body: string;
  author: string;
  created_utc: Date;
  url: string;
  banned_by: string;
  isFiltered: boolean;
  matching_configs: number[];
  matching_rules: number[];
  matching_check_combinations: number[];
  matching_checks: MatchingCheck[];
}

export interface MatchingCheck {
  id: number;
  field: string;
  start: number;
  end: number;
  _check_id: number;
  check_combination_ids: number[];
  rule_id: number;
  config_id: number;
}

export interface PaginatedPosts {
  count: number;
  nextPage: number;
  results: IPost[];
}

export interface Config {
  id: number;
  code: string;
  created_at: Date;
  rules: Rule[];
}

export interface Rule {
  id: number;
  code: string;
  created_at: Date;
  checks: Check[];
  check_combinations: CheckCombination[];
  subreddit_count: number;
  spam_count: number;
}

export interface CheckCombination {
  id: number;
  checks: Check[];
  subreddit_count: number;
  spam_count: number;
  code: string;
}

export interface Check {
  id: number;
  fields: string;
  word: string;
  subreddit_count: number;
  spam_count: number;
  code: string;
}

export interface IStat {
  x0: string;
  x1: string;
  y: number;
}
