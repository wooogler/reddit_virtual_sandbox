import pandas as pd
import re
import unicodedata

from nltk import sent_tokenize
import numpy as np
import tensorflow_hub as hub
import matplotlib.pyplot as plt

#
# Load Google Universal Encoder
module_url = "https://tfhub.dev/google/universal-sentence-encoder/4"
model = hub.load(module_url)
print("module %s loaded" % module_url)


def embed(input_):
    return model(input_)


def get_average_vector(vector_list):
    if vector_list:
        return np.mean(vector_list, axis=0)
    return None


# Anything that isn't a square closing bracket
name_regex = "[^]]+"
# http:// or https:// followed by anything but a closing paren
url_regex = "http[s]?://[^)]+"


def fraction_finder(text):
    passed = []
    for s in text:
        try:
            name = unicodedata.name(s)
        except ValueError:
            continue

        if not name.startswith("VULGAR FRACTION"):
            passed.append(s)
    return "".join(passed)


def process_sentence(raw):
    raw = unicodedata.normalize("NFKD", raw)
    sentences = sent_tokenize(raw)  # split post into sentences
    processed_sentences = []

    for text in sentences:
        # remove special chr
        text = text.replace("&amp;#x200B;", "")
        # remove newline
        text = text.replace("\r\n", " ")
        text = text.replace("\r\r", " ")
        text = text.replace("\r", " ")
        text = text.replace("\n", " ")
        text = text.replace("\t", " ")

        # remove markdown
        text = re.sub(
            "\[({0})]\(\s*({1})\s*\)".format(name_regex, url_regex), " ", text
        )
        # remove url
        text = re.sub(r"http[s]?://[^)]+", " ", text)
        # # strip numbers
        # text = re.sub(r'\d+', ' ', text)
        # punctuation removal
        text = re.sub(r"[^\w\s]", " ", text)
        # vulgar fraction removal
        text = fraction_finder(text)
        # white spaces removal
        text = text.strip()

        if len(text) > 0:
            processed_sentences.append(text)

    return " ".join(processed_sentences)


def process_embedding(content):
    """
    :param content:
    :return: embedding vector
    """
    processed = process_sentence(content)
    return np.array(embed([processed])[0])


def get_weighted_embedding(sub, title_ratio):
    return (process_embedding(sub['title']) * title_ratio) + (process_embedding(sub['body']) * (1 - title_ratio))


def get_embedding(sub):
    return process_embedding(sub['title'] + ' ' + sub['body'])


labeled_sub = pd.read_json('./submission_cscareerquestions_may_labeled.json')

sub_rule1 = labeled_sub[labeled_sub['rule_1'] == 1]

# sub_rule2 = labeled_sub[labeled_sub['rule_2'] == 1]
# random_rule2 = sub_rule1.sample(n=3)

x = []
y_avg = []

for ratio in np.arange(0, 0.4, 0.04):
    print(ratio)
    y = []
    for i in range(1, 20):
        random_rule1 = sub_rule1.sample(n=3)
        random_rule1_vector = get_average_vector(
            [get_weighted_embedding(sub, ratio) for index, sub in random_rule1.iterrows()])
        # random_rule2_vector = get_average_vector([get_embedding(sub) for index, sub in random_rule2.iterrows()])

        sim1 = []
        # sim2 = []
        for index, sub in labeled_sub.iterrows():
            embedding = get_weighted_embedding(sub, ratio)
            sim1.append(np.inner(embedding, random_rule1_vector))
            # sim2.append(np.inner(embedding, random_rule1_vector))

        labeled_sub['sim1'] = sim1
        # labeled_sub['sim2'] = sim2

        sorted_labeled_sub1 = labeled_sub.sort_values(by=['sim1'], axis=0, ascending=False)
        df1 = sorted_labeled_sub1['rule_1'].reset_index(drop=True)
        # sorted_labeled_sub2 = labeled_sub.sort_values(by=['sim2'], axis=0, ascending=False)
        # df2 = sorted_labeled_sub2['rule_2'].reset_index(drop=True)
        y.append(len(df1.head(50)[df1 == 1]))
    x.append(ratio)
    y_avg.append(np.mean(y))

y = []
print('one body')
for i in range(1, 20):
    random_rule1 = sub_rule1.sample(n=3)
    random_rule1_vector = get_average_vector(
        [get_embedding(sub) for index, sub in random_rule1.iterrows()])
    # random_rule2_vector = get_average_vector([get_embedding(sub) for index, sub in random_rule2.iterrows()])

    sim1 = []
    # sim2 = []
    for index, sub in labeled_sub.iterrows():
        embedding = get_embedding(sub)
        sim1.append(np.inner(embedding, random_rule1_vector))
        # sim2.append(np.inner(embedding, random_rule1_vector))

    labeled_sub['sim1'] = sim1
    # labeled_sub['sim2'] = sim2

    sorted_labeled_sub1 = labeled_sub.sort_values(by=['sim1'], axis=0, ascending=False)
    df1 = sorted_labeled_sub1['rule_1'].reset_index(drop=True)
    y.append(len(df1.head(50)[df1 == 1]))

x.append(0.5)
y_avg.append(np.mean(y))

plt.plot(x, y_avg, 'bo')
plt.show()
