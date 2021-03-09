import re
import unicodedata
from sklearn.metrics.pairwise import cosine_similarity

from nltk.tokenize import sent_tokenize
from sentence_transformers import SentenceTransformer
import numpy as np

# https://stackoverflow.com/questions/23394608/python-regex-fails-to-identify-markdown-links
# Anything that isn't a square closing bracket
name_regex = "[^]]+"
# http:// or https:// followed by anything but a closing paren
url_regex = "http[s]?://[^)]+"
# Define model
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

def process_and_return_embedding(raw):
    raw = unicodedata.normalize("NFKD", raw)
    sentences = sent_tokenize(raw) # split post into sentences
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

def compute_cosine_similarity(seeds, filtered_posts):

    '''
    example of seeds: [{'_id': 'gk0p7ra', 'body': 'asdfasd\nfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd'}
    example of filtered posts: [{'_id': 'gliel3c', 'body': 'Oh fuck haha'}, {'_id': 'glm9g22', 'body': 'Mechanics'}]
    '''

    # TODO: sentence or post?

    #seeds = [{'_id': 'seed1', 
    #    'body': 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfqwer\n\nqwerqwerqwerqwerqwerqewr'}, 
    #    {'_id': 'seed2', 'body': 'asdfasdfasdfasdfqw\n\n&#x200B;\n\nasdfawerqweqwerqwer\n\nqwerqwerqwer'}]
    #filtered_posts = [{'_id': 'gk0p7ra', 'body': 'asdfasdfasdfasdfasdfasdffasdfasdfasdfasdfasdfasdfasdfasdfqwer\n\nqwerqwerqwerqwerqwerqewr'}, {'_id': 'l1p3je', 'body': 'asdfasdfasdfasdfqw\n\n&#x200B;\n\nasdfawerqweqwerqwer\n\nqwerqwerqwer'}]
    
    #seeds = [{'_id': 'seed1', 'body': 'haha'}]
    #filtered_posts = [{'_id':'sample1', 'body': 'haha'}]
    print(len(seeds))
    # get ML embeddings for seed samples
    seed_embs = []
    for seed in seeds:
        seed_emb, _ = process_and_return_embedding(seed['body'])
        # print(np.array(seed_emb).shape) # number of sentences, 768 
        seed_embs.append(np.mean(seed_emb, axis=0)) # 768
   
    
    # get ML embeddings for filtered posts
    filtered_embs = []
    for filtered_post in filtered_posts:
        filtered_emb, _ = process_and_return_embedding(filtered_post['body'])
        filtered_embs.append(np.mean(filtered_emb, axis=0))
        #print(filtered_embs[-1].shape) # 768

    filtered_embs = np.array(filtered_embs) # [# of filtered posts, dim]
    
    # get average ML embedding
    seed_avg_emb = np.mean(np.array(seed_embs), axis=0).reshape(1, -1) # [1, dim]

    return cosine_similarity(filtered_embs, seed_avg_emb).reshape(-1) # [# of filtered posts]
