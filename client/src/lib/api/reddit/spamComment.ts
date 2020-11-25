export interface SpamComment {
  type: 'spam_comment'
  banned_by: string;
  id: string;
  removal_reason: string | null;
  link_id: string;
  banned_at_utc: number;
  removed: boolean;
  author: string;
  body: string;
  spam: boolean;
  approved: boolean;
  permalink: string;
  subreddit: string;
  created_utc: number;
  filter_id: string[];
}