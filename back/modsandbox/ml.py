import re
import unicodedata

from nltk import sent_tokenize
import tensorflow as tf
import numpy as np
import tensorflow_hub as hub

#
# Load Google Universal Encoder
module_url = "https://tfhub.dev/google/universal-sentence-encoder/4"
model = hub.load(module_url)
print("module %s loaded" % module_url)


def embed(input_):
    return model(input_)


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
