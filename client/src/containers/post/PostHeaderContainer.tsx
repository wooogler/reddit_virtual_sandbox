import React from 'react'
import { useSelector } from 'react-redux'
import PostHeader from '../../components/post/PostHeader';
import { RootState } from '../../modules'

function PostHeaderContainer() {
  const me = useSelector((state: RootState) => state.user.me);
  const redditLogged = useSelector((state: RootState) => state.user.reddit_logged);

  return (
    <PostHeader userInfo={me} redditLogged={redditLogged}/>
  )
}

export default PostHeaderContainer
