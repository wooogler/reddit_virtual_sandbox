import pinecone
import os


def create_index_pinecone(username: str):
    init_pinecone()
    index_name = 'modsandbox' + username
    if index_name in pinecone.list_indexes():
        pinecone.delete_index(index_name)

    pinecone.create_index(name=index_name, metric='dotproduct', shards=1)


def get_index_pinecone(username: str):
    init_pinecone()
    index_name = 'modsandbox' + username
    return pinecone.Index(name=index_name, response_timeout=300)


def init_pinecone():
    pinecone.init(api_key=os.getenv('pinecone_api_key'))
