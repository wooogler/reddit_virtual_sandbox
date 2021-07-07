import ast

import pandas as pd
import numpy as np


def stringTolist(value):
    return value


post_vectors = pd.read_pickle('post_vectors_leesang627.pkl')
vector1 = post_vectors[post_vectors.id == 20496].vector.tolist()
vector2 = post_vectors.iloc[2].vector.tolist()
print(np.inner(vector2, vector1)[0])
