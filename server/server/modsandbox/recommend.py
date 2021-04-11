import unicodedata
import re
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer

import numpy as np

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

def process_raw(raw):
    raw = unicodedata.normalize("NFKD", raw)
    sentences = sent_tokenize(raw)
    processed_sentences = []

    for text in sentences:
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
    
    return processed_sentences

def compute_recommendation(targets, non_targets):
    processed_targets = [" ".join(process_raw(post.body)) for post in targets]
    processed_non_targets = [" ".join(process_raw(post.body)) for post in non_targets]

    target_vector = CountVectorizer(
        stop_words=stopwords.words("english"), ngram_range=(1,2), binary=True
    )
    target_dtm = target_vector.fit_transform(processed_targets).toarray()
    np_target_dtm = np.sum(target_dtm, axis=0)
    target_vocab = target_vector.vocabulary_

    non_target_vector = CountVectorizer(
        vocabulary=target_vocab.keys(),
        binary=True
    )
    non_target_dtm = non_target_vector.fit_transform(processed_non_targets).toarray()
    np_non_target_dtm = np.sum(non_target_dtm, axis=0)
    non_target_vocab = non_target_vector.vocabulary_

    word_freq = [
        {
            "word": key, 
            "target_freq": np_target_dtm[val], 
            "non_target_freq": np_non_target_dtm[non_target_vocab[key]]
        } for key, val in target_vocab.items()]

    return word_freq





    