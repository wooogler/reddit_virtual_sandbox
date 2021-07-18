export interface AutoModStat {
  part: number;
  total: number;
}

export interface Setting {
  live_sub_recent?: string;
  live_com_recent?: string;
  live_sub_count: number;
  live_com_count: number;
  spam_sub_recent?: string;
  spam_com_recent?: string;
  spam_sub_count: number;
  spam_com_count: number;
}

export interface ImportSetting {
  subreddit: string;
  where: 'all' | 'Subreddit' | 'Spam';
  after: '3months' | 'month' | '2weeks' | 'week' | '3days';
  type: 'all' | 'Submission' | 'Comment';
}

export type Condition = 'baseline' | 'sandbox' | 'modsandbox';
export type Task = 'A1' | 'B1' | 'A2' | 'B2' | 'example';
export type Order = '1' | '2';

export type EditorState = 'add' | 'edit' | false;
