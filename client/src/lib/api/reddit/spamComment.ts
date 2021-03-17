export interface SpamComment {
  id: number;
  type: 'spam_comment'
  banned_by: string;
  _id: string;
  removal_reason: string | null;
  link_id: string;
  banned_at_utc: number;
  removed: boolean;
  author: string;
  body: string;
  spam: boolean;
  approved: boolean;
  full_link: string;
  subreddit: string;
  created_utc: number;
  matching_rules: string[];
}