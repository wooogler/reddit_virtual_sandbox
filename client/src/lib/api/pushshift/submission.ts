import axios from 'axios';

export async function getSubmissions(subredditName: string) {
  const response = await axios.get<{data: Submission[]}>(
    `https://api.pushshift.io/reddit/search/submission/?subreddit=${subredditName}`,
  );
  return response.data.data;
}

export interface Submission {
  all_awardings: any[];
  allow_live_comments: boolean;
  author: string;
  author_flair_background_color: string;
  author_flair_richtext: any[];
  author_flair_text?: string;
  author_flair_text_color: 'dark' | 'light';
  author_flair_type: string;
  author_fullname: string;
  author_patreon_flair: boolean;
  author_premium: boolean;
  awarders: any[];
  can_mod_post: boolean;
  contest_mode: boolean;
  created_utc: number;
  crosspost_parent: string;
  crosspost_parent_list: CrosspostParentList[];
  domain: string;
  full_link: string;
  gildings: Gildings;
  id: string;
  is_crosspostable: boolean;
  is_meta: boolean;
  is_original_content: boolean;
  is_reddit_media_domain: boolean;
  is_robot_indexable: boolean;
  is_self: boolean;
  is_video: boolean;
  link_flair_background_color: string;
  link_flair_richtext: any[];
  link_flair_template_id: string;
  link_flair_text: string;
  link_flair_text_color: 'dark' | 'light';
  link_flair_type: string;
  locked: boolean;
  media_only: boolean;
  no_follow: boolean;
  num_comments: number;
  num_crossposts: number;
  over_18: boolean;
  permalink: string;
  pinned: boolean;
  post_hint: string;
  preview: Preview;
  retrieved_on: number;
  score: number;
  selftext: string;
  send_replies: boolean;
  spoiler: boolean;
  stickied: boolean;
  subreddit: string;
  subreddit_id: string;
  subreddit_subscribers: number;
  subreddit_type: string;
  thumbnail: string;
  thumbnail_height: number;
  thumbnail_width: number;
  title: string;
  total_awards_received: number;
  treatment_tags: any[];
  upvote_ratio: number;
  url: string;
  url_overridden_by_dest: string;
}

export interface CrosspostParentList {
  all_awardings: AllAwarding[];
  allow_live_comments: boolean;
  approved_at_utc: null;
  approved_by: null;
  archived: boolean;
  author: string;
  author_flair_background_color: null;
  author_flair_css_class: null;
  author_flair_richtext: any[];
  author_flair_template_id: null;
  author_flair_text: null;
  author_flair_text_color: null;
  author_flair_type: string;
  author_fullname: string;
  author_patreon_flair: boolean;
  author_premium: boolean;
  awarders: any[];
  banned_at_utc: null;
  banned_by: null;
  can_gild: boolean;
  can_mod_post: boolean;
  category: null;
  clicked: boolean;
  content_categories: null;
  contest_mode: boolean;
  created: number;
  created_utc: number;
  discussion_type: null;
  distinguished: null;
  domain: string;
  downs: number;
  edited: boolean;
  gilded: number;
  gildings: Gildings;
  hidden: boolean;
  hide_score: boolean;
  id: string;
  is_crosspostable: boolean;
  is_meta: boolean;
  is_original_content: boolean;
  is_reddit_media_domain: boolean;
  is_robot_indexable: boolean;
  is_self: boolean;
  is_video: boolean;
  likes: null;
  link_flair_background_color: string;
  link_flair_css_class: string;
  link_flair_richtext: any[];
  link_flair_template_id: string;
  link_flair_text: string;
  link_flair_text_color: string;
  link_flair_type: string;
  locked: boolean;
  media: null;
  media_embed: Gildings;
  media_only: boolean;
  mod_note: null;
  mod_reason_by: null;
  mod_reason_title: null;
  mod_reports: any[];
  name: string;
  no_follow: boolean;
  num_comments: number;
  num_crossposts: number;
  num_reports: null;
  over_18: boolean;
  parent_whitelist_status: string;
  permalink: string;
  pinned: boolean;
  post_hint: string;
  preview: Preview;
  pwls: number;
  quarantine: boolean;
  removal_reason: null;
  removed_by: null;
  removed_by_category: null;
  report_reasons: null;
  saved: boolean;
  score: number;
  secure_media: null;
  secure_media_embed: Gildings;
  selftext: string;
  selftext_html: null;
  send_replies: boolean;
  spoiler: boolean;
  stickied: boolean;
  subreddit: string;
  subreddit_id: string;
  subreddit_name_prefixed: string;
  subreddit_subscribers: number;
  subreddit_type: string;
  suggested_sort: string;
  thumbnail: string;
  thumbnail_height: number;
  thumbnail_width: number;
  title: string;
  top_awarded_type: null;
  total_awards_received: number;
  treatment_tags: any[];
  ups: number;
  upvote_ratio: number;
  url: string;
  url_overridden_by_dest: string;
  user_reports: any[];
  view_count: null;
  visited: boolean;
  whitelist_status: string;
  wls: number;
}

export interface AllAwarding {
  award_sub_type: string;
  award_type: string;
  awardings_required_to_grant_benefits: null;
  coin_price: number;
  coin_reward: number;
  count: number;
  days_of_drip_extension: number;
  days_of_premium: number;
  description: string;
  end_date: null;
  giver_coin_reward: null;
  icon_format: null;
  icon_height: number;
  icon_url: string;
  icon_width: number;
  id: string;
  is_enabled: boolean;
  is_new: boolean;
  name: string;
  penny_donate: null;
  penny_price: null;
  resized_icons: Source[];
  resized_static_icons: Source[];
  start_date: null;
  static_icon_height: number;
  static_icon_url: string;
  static_icon_width: number;
  subreddit_coin_reward: number;
  subreddit_id: null;
  tiers_by_required_awardings: null;
}

export interface Source {
  height: number;
  url: string;
  width: number;
}

export interface Gildings {}

export interface Preview {
  enabled: boolean;
  images: Image[];
}

export interface Image {
  id: string;
  resolutions: Source[];
  source: Source;
  variants: Gildings;
}
