export interface SpamSubmission {
  type: 'spam_submission';
  subreddit: string;
  body: string;
  title: string;
  banned_by: string;
  banned_at_utc: number;
  spam: boolean;
  removed_by: string;
  id: string;
  author: string;
  approved: boolean;
  full_link: string;
  created_utc: number;
  matching_rules: string[];
  removal_reason: string | null;
}