import React from 'react'
import { useSelector } from 'react-redux'
import PostHeader from '../../components/post/PostHeader';
import { RootState } from '../../modules'

function PostHeaderContainer() {
  const me = useSelector((state: RootState) => state.user.me);

  return (
    <PostHeader userInfo={me}/>
  )
}

export default PostHeaderContainer
