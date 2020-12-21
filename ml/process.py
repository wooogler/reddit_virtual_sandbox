import zstandard as zstd
import json
import re
import unicodedata

from nltk.tokenize import sent_tokenize
from sentence_transformers import SentenceTransformer

# https://stackoverflow.com/questions/23394608/python-regex-fails-to-identify-markdown-links
# Anything that isn't a square closing bracket
name_regex = "[^]]+"
# http:// or https:// followed by anything but a closing paren
url_regex = "http[s]?://[^)]+"

model = SentenceTransformer('distilbert-base-nli-stsb-mean-tokens')

def fraction_finder(text):
    passed = []
    for s in text:
        try:
            name = unicodedata.name(s)
        except ValueError:
            continue

        if not name.startswith('VULGAR FRACTION'):
            passed.append(s)
    return ''.join(passed)

def process_and_return_embedding(text):
    text = unicodedata.normalize("NFKD", text)
    sentences = sent_tokenize(text) # split post into sentences
    processed_sentences = []
    for text in sentences:
        # remove special chr
        text = text.replace('&amp;#x200B;', '')
        # remove newline
        text = text.replace('\r\n', ' ')
        text = text.replace('\r\r', ' ')
        text = text.replace('\r', ' ')
        text = text.replace('\n', ' ')
        text = text.replace('\t', ' ')

        # remove markdown
        text = re.sub('\[({0})]\(\s*({1})\s*\)'.format(name_regex, url_regex), ' ', text)
        # remove url
        text = re.sub(r'http[s]?://[^)]+', ' ', text)
        # # strip numbers
        # text = re.sub(r'\d+', ' ', text)
        # punctuation removal
        text = re.sub(r'[^\w\s]', ' ', text)
        # vulgar fraction removal
        text = fraction_finder(text)
        # white spaces removal
        text = text.strip()

        if len(text) > 0:
            processed_sentences.append(text)

    sentence_embeddings = model.encode(processed_sentences)
    return (sentence_embeddings, processed_sentences)


with open("RS_2020-04.zst", 'rb') as fh:
    dctx = zstd.ZstdDecompressor()
    with dctx.stream_reader(fh) as reader:
        previous_line = ""
        while True:
            chunk = reader.read(65536)
            if not chunk:
                break

            string_data = chunk.decode('utf-8')
            lines = string_data.split("\n")
            for i, line in enumerate(lines[:-1]):
                if i == 0:
                    line = previous_line + line
                object = json.loads(line)

                # return sentence-level embedding vectors and preprocessed sentences
                ml_embeddings, preprocessed_text = process_and_return_embedding(object["selftext"])

            previous_line = lines[-1]
            break