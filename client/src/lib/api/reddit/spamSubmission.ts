export interface SpamSubmission {
  type: 'spam_submision';
  subreddit: string;
  selftext: string;
  title: string;
  banned_by: string;
  banned_at_utc: number;
  spam: boolean;
  removed_by: string;
  id: string;
  author: string;
  approved: boolean;
  permalink: string;
  url: string;
  created_utc: number;
}