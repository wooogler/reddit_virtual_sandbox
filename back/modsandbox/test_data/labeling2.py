import pandas as pd

gt = pd.read_csv('./gt_rule1.csv')
content = pd.read_json('./submission_cscareerquestions_may_w_index_clip.json')
gt_content = pd.merge(gt, content, left_on='index', right_on='index')
gt_content.to_csv('./gt_content_rule1.csv')

gt_content = pd.read_csv('./gt_content_rule1.csv')

sub1 = pd.read_json('./submission_cscareerquestions_may_1st.json')
labeled_sub1 = pd.merge(sub1, gt_content, left_on='created_utc', right_on='created_utc', how='inner')

_labeled_sub1 = labeled_sub1.drop(columns=['title_y', 'body_y', 'Unnamed: 0', 'index']).rename(
    columns={'title_x': 'title', 'body_x': 'body'})

print(_labeled_sub1)

_labeled_sub1[(_labeled_sub1['annotator-1'] == 1) | (_labeled_sub1['annotator-2'] == 1)].to_csv('rule1_annotator.csv')
