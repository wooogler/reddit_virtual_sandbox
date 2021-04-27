import React, { ReactElement } from 'react';
import SplitPane from 'react-split-pane';

import PostList from '@components/PostList';
import { mockPosts } from './TestLayout';

function FindLayout(): ReactElement {
  return (
    <div className='h-screen'>
      <SplitPane split='horizontal'>
        <PostList label='FN' posts={mockPosts} />
        <PostList label='FP' posts={mockPosts} />
      </SplitPane>
    </div>
  );
}

export default FindLayout;
