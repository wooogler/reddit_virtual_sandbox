import pandas as pd
import numpy as np

subs = pd.read_json('./submission_cscareerquestions_may_1st_labeled_old.json')
subs_eval = pd.read_json('./submission_cscareerquestions_may_2nd_labeled_old.json')

rule1_new = pd.read_csv('./rule1_new.csv')
rule1_eval_new = pd.read_csv('./rule1_eval_new.csv')

subs.update(pd.DataFrame({'rule_1': np.zeros(len(subs))}))
subs.update(rule1_new)
subs['rule_1'] = subs['rule_1'].astype(int)
subs.to_json('./submission_cscareerquestions_may_1st_labeled.json', orient='records', indent=2)

subs_eval.update(pd.DataFrame({'rule_1': np.zeros(len(subs_eval))}))
subs_eval.update(rule1_eval_new)
subs_eval['rule_1'] = subs_eval['rule_1'].astype(int)
subs_eval.to_json('./submission_cscareerquestions_may_2nd_labeled.json', orient='records', indent=2)
