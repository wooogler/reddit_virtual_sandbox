export interface AutoModStat {
  part: number;
  total: number;
}

export interface Setting {
  sub_recent?: string;
  com_recent?: string;
  sub_count: number;
  com_count: number;
}

export interface importSetting {
  subreddit: string;
  after: '3months' | 'month' | '2weeks' | 'week';
  type: 'all' | 'sub' | 'com';
}
