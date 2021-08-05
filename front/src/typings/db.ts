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
  matching_lines: number[];
  matching_checks: MatchingCheck[];
  matching_not_checks: MatchingCheck[];
  sim: number;
  score: number;
  rule_1: number;
  rule_2: number;
}

export interface MatchingCheck {
  id: number;
  field: string;
  start: number;
  end: number;
  _check_id: number;
  line_id: number;
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
  subreddit_count: number;
  spam_count: number;
  target_count: number;
  except_count: number;
  rules: Rule[];
}

export interface Rule {
  id: number;
  code: string;
  subreddit_count: number;
  spam_count: number;
  target_count: number;
  except_count: number;
  checks: Check[];
  check_combinations: CheckCombination[];
  lines: Line[];
}

export interface Line {
  id: number;
  code: string;
  subreddit_count: number;
  spam_count: number;
  target_count: number;
  except_count: number;
  checks: Check[];
}

export interface CheckCombination {
  id: number;
  code: string;
  subreddit_count: number;
  spam_count: number;
  target_count: number;
  except_count: number;
  checks: Check[];
}

export interface Check {
  id: number;
  code: string;
  subreddit_count: number;
  spam_count: number;
  target_count: number;
  except_count: number;
}

export interface IStat {
  x0: string;
  x1: string;
  y: number;
}
