import pandas as pd

sub = pd.read_json('./submission_cscareerquestions_may_1st_labeled.json')

print(sub)
sub_rule_1 = sub[sub['rule_1'] == 1]
sub_rule_2 = sub[sub['rule_2'] == 1]

random_rule_1 = sub_rule_1.sample(n=3, random_state=1)
random_rule_2 = sub_rule_2.sample(n=3, random_state=1)

print(random_rule_1)
print(random_rule_2)

random_rule_1.to_json('./submission_cscareerquestions_may_1st_rule1.py', orient='records', indent=2)
random_rule_2.to_json('./submission_cscareerquestions_may_1st_rule2.py', orient='records', indent=2)

rest = sub.drop(random_rule_1.index).drop(random_rule_2.index)

rest.to_json('./submission_cscareerquestions_may_1st_rest.py', orient='records', indent=2)
