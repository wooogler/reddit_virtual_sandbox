import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import palette, { actionColorMap } from '../../lib/styles/palette';
import { selectSubmission } from '../../modules/post';
import AuthorText from '../common/AuthorText';
import BodyText from '../common/BodyText';
import FlairText from '../common/FlairText';
import IdText from '../common/IdText';
import TitleText from '../common/TitleText';

export interface PostItemProps {
  post: Submission;
  ellipsis: boolean;
  action?: 'remove' | 'report';
}

function PostItem({ post, ellipsis, action }: PostItemProps) {
  const dispatch = useDispatch();
  const handleClick = (postId: string) => {
    dispatch(selectSubmission(postId));
  };

  return (
    <PostItemDiv action={action} onClick={() => handleClick(post.id)}>
      <TitleText text={post.title} ellipsis={ellipsis} />
      <div className="submission-info">
        {post.link_flair_text && (
          <FlairText
            text={post.link_flair_text}
            color={post.link_flair_text_color}
            background={post.link_flair_background_color}
          />
        )}
        <IdText text={post.id} />
      </div>
      <BodyText text={post.selftext} ellipsis={ellipsis} />
      <div className="author-info">
        <AuthorText text={post.author} />
        {post.author_flair_text && (
          <FlairText
            text={post.author_flair_text}
            color={post.author_flair_text_color}
            background={post.author_flair_background_color}
          />
        )}
        <IdText text={post.author_fullname} />
      </div>
    </PostItemDiv>
  );
}

const PostItemDiv = styled.div<{ action?: 'remove' | 'report' }>`
  width: auto;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border: 1px solid ${palette.gray[2]};
  background-color: ${(props) =>
    props.action ? actionColorMap[props.action].background : 'white'};
  .submission-info {
    display: flex;
    margin: 0.5rem 0;
    div + div {
      margin-left: 0.5rem;
    }
  }
  .author-info {
    display: flex;
    margin-top: 0.5rem;
    div + div {
      margin-left: 0.5rem;
    }
  }
`;

export default PostItem;
