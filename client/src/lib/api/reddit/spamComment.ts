export interface SpamComment {
  total_awards_received:           number;
  approved_at_utc:                 null;
  comment_type:                    null;
  awarders:                        any[];
  mod_reason_by:                   null;
  banned_by:                       string;
  ups:                             number;
  author_flair_type:               string;
  removal_reason:                  null;
  link_id:                         string;
  author_flair_template_id:        null;
  likes:                           boolean;
  replies:                         Replies;
  user_reports:                    any[];
  ban_note:                        string;
  saved:                           boolean;
  id:                              string;
  banned_at_utc:                   number;
  mod_reason_title:                null;
  gilded:                          number;
  archived:                        boolean;
  removed:                         boolean;
  no_follow:                       boolean;
  author:                          string;
  can_mod_post:                    boolean;
  send_replies:                    boolean;
  parent_id:                       string;
  score:                           number;
  author_fullname:                 string;
  report_reasons:                  any[];
  approved_by:                     null;
  all_awardings:                   any[];
  subreddit_id:                    string;
  ignore_reports:                  boolean;
  body:                            string;
  edited:                          boolean;
  downs:                           number;
  author_flair_css_class:          string;
  is_submitter:                    boolean;
  collapsed:                       boolean;
  author_flair_richtext:           any[];
  author_patreon_flair:            boolean;
  collapsed_reason:                null;
  gildings:                        Gildings;
  spam:                            boolean;
  associated_award:                null;
  stickied:                        boolean;
  author_premium:                  boolean;
  subreddit_type:                  string;
  can_gild:                        boolean;
  top_awarded_type:                null;
  approved:                        boolean;
  author_flair_text_color:         string;
  score_hidden:                    boolean;
  permalink:                       string;
  num_reports:                     number;
  locked:                          boolean;
  name:                            string;
  created:                         number;
  subreddit:                       string;
  author_flair_text:               string;
  treatment_tags:                  any[];
  rte_mode:                        string;
  created_utc:                     number;
  subreddit_name_prefixed:         string;
  controversiality:                number;
  depth:                           number;
  author_flair_background_color:   string;
  collapsed_because_crowd_control: null;
  mod_reports:                     any[];
  body_html:                       string;
  mod_note:                        null;
  distinguished:                   null;
}

export interface Replies {
  kind: string;
  data: RepliesData;
}

export interface RepliesData {
  modhash:  string;
  dist:     null;
  children: Child[];
  after:    null;
  before:   null;
}

export interface Child {
  kind: string;
  data: ChildData;
}

export interface ChildData {
  total_awards_received:           number;
  approved_at_utc:                 null;
  ignore_reports:                  boolean;
  comment_type:                    null;
  awarders:                        any[];
  mod_reason_by:                   null;
  banned_by:                       null;
  ups:                             number;
  author_flair_type:               string;
  removal_reason:                  null;
  link_id:                         string;
  author_flair_template_id:        null;
  likes:                           null;
  replies:                         string;
  user_reports:                    any[];
  saved:                           boolean;
  id:                              string;
  banned_at_utc:                   null;
  mod_reason_title:                null;
  gilded:                          number;
  archived:                        boolean;
  removed:                         boolean;
  no_follow:                       boolean;
  author:                          string;
  can_mod_post:                    boolean;
  send_replies:                    boolean;
  parent_id:                       string;
  score:                           number;
  author_fullname:                 string;
  report_reasons:                  any[];
  approved_by:                     null;
  all_awardings:                   any[];
  subreddit_id:                    string;
  collapsed:                       boolean;
  body:                            string;
  edited:                          boolean;
  author_flair_css_class:          null;
  is_submitter:                    boolean;
  downs:                           number;
  author_flair_richtext:           any[];
  author_patreon_flair:            boolean;
  body_html:                       string;
  gildings:                        Gildings;
  collapsed_reason:                null;
  associated_award:                null;
  stickied:                        boolean;
  author_premium:                  boolean;
  subreddit_type:                  string;
  can_gild:                        boolean;
  top_awarded_type:                null;
  approved:                        boolean;
  author_flair_text_color:         null;
  score_hidden:                    boolean;
  permalink:                       string;
  num_reports:                     number;
  locked:                          boolean;
  name:                            string;
  created:                         number;
  subreddit:                       string;
  author_flair_text:               null;
  treatment_tags:                  any[];
  spam:                            boolean;
  created_utc:                     number;
  subreddit_name_prefixed:         string;
  controversiality:                number;
  depth:                           number;
  author_flair_background_color:   null;
  collapsed_because_crowd_control: null;
  mod_reports:                     any[];
  mod_note:                        null;
  distinguished:                   string;
}

export interface Gildings {
}