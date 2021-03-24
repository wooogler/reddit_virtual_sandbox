from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
import numpy as np

lectures = ["this is some food", "this is some drink"]

vectorizer = CountVectorizer(ngram_range=(1, 2), vocabulary=['this', 'is'])

dtm = vectorizer.fit_transform(lectures).toarray()
doc_freq = np.sum(dtm, axis=0)  # [0,1]
vocab = vectorizer.vocabulary_  # {'key1': 1, 'key2': 0}

print(doc_freq)
print(vocab)