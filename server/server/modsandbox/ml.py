import re
import unicodedata
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import spacy
import pickle

from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from sentence_transformers import SentenceTransformer
from collections import defaultdict

import numpy as np

# https://stackoverflow.com/questions/23394608/python-regex-fails-to-identify-markdown-links
# Anything that isn't a square closing bracket
name_regex = "[^]]+"
# http:// or https:// followed by anything but a closing paren
url_regex = "http[s]?://[^)]+"
# Define model
model = SentenceTransformer("distilbert-base-nli-stsb-mean-tokens")

# load the language model
nlp = spacy.load("en_core_web_md")


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


def process_and_return_embedding(raw, is_embedding):
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

    if is_embedding == True:
        if processed_sentences == []:
            processed_sentences = ["no content"]

        sentence_embeddings = model.encode(processed_sentences)

        return sentence_embeddings

    else:
        return processed_sentences


def word_similarity(word1, word2):
    token1 = nlp(word1)[0]
    token2 = nlp(word2)[0]
    return token1.similarity(token2)

def compute_word_frequency_similarity(posts, spams, keyword):
    vocab_name = 'vocab_tutorial'
    token_name = 'token_tutorial'

    post_doc_freq=[]
    spam_doc_freq=[]
    try: 
        with open(vocab_name+'.pickle', 'rb') as pfile:
            print('read '+vocab_name+'.pickle')
            # (post_doc_freq, post_vocab, spam_doc_freq, spam_vocab) = pickle.load(pfile)
            (post_doc_freq, post_vocab) = pickle.load(pfile)
    except IOError:
        with open(vocab_name+'.pickle', 'wb') as pfile:
            print('no '+vocab_name+'.pickle')
            post_documents = []
            for post in posts:
                processed_sentences = process_and_return_embedding(post["body"], False)
                post_document = " ".join(processed_sentences)
                post_documents.append(post_document)

            # spam_documents = []
            # for spam in spams:
            #     processed_sentences = process_and_return_embedding(spam["body"], False)
            #     spam_document = " ".join(processed_sentences)
            #     spam_documents.append(spam_document)

            post_vector = CountVectorizer(
                stop_words=stopwords.words("english"), ngram_range=(1, 3), min_df=2, max_df=0.05, binary=True
            )

            post_dtm = post_vector.fit_transform(post_documents).toarray()
            post_doc_freq = np.sum(post_dtm, axis=0)  # [0,1]
            post_vocab = post_vector.vocabulary_  # {'key1': 1, 'key2': 0}

            # spam_vector = CountVectorizer(
            #     stop_words=stopwords.words("english"), ngram_range=(1, 2), binary=True
            # )

            # spam_dtm = spam_vector.fit_transform(spam_documents).toarray()
            # spam_doc_freq = np.sum(spam_dtm, axis=0)  # [0,1]
            # spam_vocab = spam_vector.vocabulary_  # {'key1': 1, 'key2': 0}
            # pickle.dump((post_doc_freq, post_vocab, spam_doc_freq, spam_vocab), pfile, protocol=pickle.HIGHEST_PROTOCOL)
            pickle.dump((post_doc_freq, post_vocab), pfile, protocol=pickle.HIGHEST_PROTOCOL)

    # vocab = defaultdict(lambda: [-1, -1])

    # for k, v in post_vocab.items():
    #     vocab[k][0] = v

    # for k, v in spam_vocab.items():
    #     vocab[k][1] = v

    try: 
        with open(token_name+'.pickle', 'rb') as pfile:
            print('read '+token_name+'.pickle')
            token_array=pickle.load(pfile)
    except IOError:
        print('no '+token_name+'.pickle')
        # token_array = {i: nlp(i) for i in vocab.keys()}
        token_array = {i: nlp(i) for i in post_vocab.keys()}
        with open(token_name+'.pickle', 'wb') as pfile:
            pickle.dump(token_array, pfile, protocol=pickle.HIGHEST_PROTOCOL) 
    
    word_freq_sim = [] # [{'word': 'key1', 'freq': 1, 'sim': 0.1}, {'word': 'key2', 'freq': 0, 'sim': 0.3}]
    token_keyword = nlp(keyword)[0]

    for key, val in post_vocab.items():
        vocab_df = {}
        vocab_df["word"] = key
        vocab_df["post_freq"] = post_doc_freq[val]
        # vocab_df["post_freq"] = post_doc_freq[val[0]] if val[0] != -1 else 0
        # vocab_df["spam_freq"] = spam_doc_freq[val[1]] if val[1] != -1 else 0
        vocab_df["sim"] = token_array[key][0].similarity(token_keyword)
        word_freq_sim.append(vocab_df)

    return word_freq_sim


def compute_word_frequency(posts):
    documents = []
    for post in posts:
        processed_sentences = process_and_return_embedding(post["body"], False)
        document = " ".join(processed_sentences)
        documents.append(document)

    vector = CountVectorizer(
        stop_words=stopwords.words("english"), ngram_range=(1, 2), binary=True
    )
    dtm = vector.fit_transform(documents).toarray()
    np_dtm = np.sum(dtm, axis=0)  # [0,1]
    vocab = vector.vocabulary_  # {'key1': 1, 'key2': 0}

    word_freq = []
    for key, val in vocab.items():
        vocab_df = {}
        vocab_df["word"] = key
        vocab_df["freq"] = np_dtm[val]
        word_freq.append(vocab_df)

    return word_freq


def compute_cosine_similarity(seeds, filtered_posts):

    """
    example of seeds: [{'_id': 'gk0p7ra', 'body': 'asdfasd\nfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'}
    example of filtered posts: [{'_id': 'gliel3c', 'body': 'Oh fuck haha'}, {'_id': 'glm9g22', 'body': 'Mechanics'}]
    """

    # TODO: sentence or post?

    # seeds = [{'_id': 'seed1',
    #    'body': 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfqwer\n\nqwerqwerqwerqwerqwerqewr'},
    #    {'_id': 'seed2', 'body': 'asdfasdfasdfasdfqw\n\n&#x200B;\n\nasdfawerqweqwerqwer\n\nqwerqwerqwer'}]
    # filtered_posts = [{'_id': 'gk0p7ra', 'body': 'asdfasdfasdfasdfasdfasdffasdfasdfasdfasdfasdfasdfasdfasdfqwer\n\nqwerqwerqwerqwerqwerqewr'}, {'_id': 'l1p3je', 'body': 'asdfasdfasdfasdfqw\n\n&#x200B;\n\nasdfawerqweqwerqwer\n\nqwerqwerqwer'}]

    # seeds = [{'_id': 'seed1', 'body': 'haha'}]
    # filtered_posts = [{'_id':'sample1', 'body': 'haha'}]
    print(len(seeds))
    # get ML embeddings for seed samples
    seed_embs = []
    for seed in seeds:
        seed_emb = process_and_return_embedding(seed["body"], True)
        # print(np.array(seed_emb).shape) # number of sentences, 768
        seed_embs.append(np.mean(seed_emb, axis=0))  # 768

    # get ML embeddings for filtered posts
    filtered_embs = []
    for filtered_post in filtered_posts:
        filtered_emb = process_and_return_embedding(filtered_post["body"], True)
        filtered_embs.append(np.mean(filtered_emb, axis=0))
        # print(filtered_embs[-1].shape) # 768

    filtered_embs = np.array(filtered_embs)  # [# of filtered posts, dim]

    # get average ML embedding
    seed_avg_emb = np.mean(np.array(seed_embs), axis=0).reshape(1, -1)  # [1, dim]

    return cosine_similarity(filtered_embs, seed_avg_emb).reshape(
        -1
    )  # [# of filtered posts]
