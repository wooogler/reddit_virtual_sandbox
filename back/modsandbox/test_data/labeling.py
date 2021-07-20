import pandas as pd

# gt = pd.read_csv('./gt.csv')
# content = pd.read_json('./submission_cscareerquestions_may_w_index_clip.json')
# gt_content = pd.merge(gt, content, left_on='index', right_on='index')
# gt_content.to_csv('./gt_content.csv')

gt_content = pd.read_csv('./gt_content.csv')

sub1 = pd.read_json('./submission_cscareerquestions_may_1st.json')
sub2 = pd.read_json('./submission_cscareerquestions_may_2nd.json')
labeled_sub1 = pd.merge(sub1, gt_content, left_on='created_utc', right_on='created_utc', how='inner')
labeled_sub2 = pd.merge(sub2, gt_content, left_on='created_utc', right_on='created_utc', how='inner')

_labeled_sub1 = labeled_sub1.drop(columns=['title_y', 'body_y', 'Unnamed: 0', 'index']).rename(
    columns={'title_x': 'title', 'body_x': 'body'})
_labeled_sub2 = labeled_sub2.drop(columns=['title_y', 'body_y', 'Unnamed: 0', 'index']).rename(
    columns={'title_x': 'title', 'body_x': 'body'})

print(_labeled_sub1)
print(_labeled_sub2)

_labeled_sub1.to_json('./submission_cscareerquestions_may_1st_labeled.json', orient='records')
_labeled_sub2.to_json('./submission_cscareerquestions_may_2nd_labeled.json', orient='records')
