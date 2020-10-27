import axios from 'axios';

export async function getCommentsAPI(submissionId: string) {
  const response = await axios.get<{ data: Comment[] }>(
    `https://api.pushshift.io/reddit/search/comment/?link_id=${submissionId}`,
  );
  return response.data.data;
}

export interface Comment {
  all_awardings:                   any[];
  approved_at_utc:                 null;
  associated_award:                null;
  author:                          string;
  author_flair_background_color:   string | null;
  author_flair_css_class:          string | null;
  author_flair_richtext:           any[];
  author_flair_template_id:        string | null;
  author_flair_text:               string | null;
  author_flair_text_color:         null;
  author_flair_type:               string;
  author_fullname:                 string;
  author_patreon_flair:            boolean;
  author_premium:                  boolean;
  awarders:                        any[];
  banned_at_utc:                   null;
  body:                            string;
  can_mod_post:                    boolean;
  collapsed:                       boolean;
  collapsed_because_crowd_control: null;
  collapsed_reason:                null;
  comment_type:                    null;
  created_utc:                     number;
  distinguished:                   null;
  edited:                          boolean;
  gildings:                        Gildings;
  id:                              string;
  is_submitter:                    boolean;
  link_id:                         string;
  locked:                          boolean;
  no_follow:                       boolean;
  parent_id:                       string;
  permalink:                       string;
  retrieved_on:                    number;
  score:                           number;
  send_replies:                    boolean;
  stickied:                        boolean;
  subreddit:                       string;
  subreddit_id:                    string;
  top_awarded_type:                null;
  total_awards_received:           number;
  treatment_tags:                  any[];
}

export interface Gildings {
}