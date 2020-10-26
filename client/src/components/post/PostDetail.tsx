import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import PostItem from './PostItem';

interface PostDetailProps {
  post: Submission | undefined;
}

function PostDetail({post}: PostDetailProps) {
  return (
    <PostDetailBlock>
      {post && <PostItem post={post} ellipsis={false}/>}
    </PostDetailBlock>
  );
}

const PostDetailBlock = styled.div`
  display: flex;
  flex-direction: column;
`


export default PostDetail;
