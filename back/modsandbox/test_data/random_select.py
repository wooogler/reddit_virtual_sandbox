import pandas as pd

sub = pd.read_json('./submission_cscareerquestions_may_1st_labeled.json')
sub_rule_1 = sub.filter(rule_1=1, axis=0)
print(sub_rule_1)
sub_rule_2 = sub.filter(rule_1=1, axis=0)
print(sub_rule_2)
