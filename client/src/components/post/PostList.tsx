import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import PostItem from './PostItem';

interface PostListProps {
  posts: Submission[] | null;
}

function PostList({posts}: PostListProps) {
  return (
    <PostListBlock>
      {posts && posts.map(post => (
        <PostItem post={post} ellipsis={true} key={post.id}/>
      ))}
    </PostListBlock>  
  );
}

const PostListBlock = styled.div`
  display: flex;
  flex-direction: column;
`

export default PostList;
