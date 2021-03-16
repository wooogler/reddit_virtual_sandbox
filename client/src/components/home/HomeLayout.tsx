import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SplitPane from 'react-split-pane';
import styled from 'styled-components';
import { AppDispatch } from '../..';
import palette from '../../lib/styles/palette';
import { getPostsRefresh, getSpamsRefresh } from '../../modules/post/actions';
import { submitCode } from '../../modules/rule/slice';
import PostLayout from '../post/PostLayout';
import RuleLayout from '../rule/RuleLayout';

function HomeLayout() {

  return (
    <HomeSplitPane
      split="vertical"
      // defaultSize={
      //   localStorage.getItem('postRulePos')
      //     ? parseInt(localStorage.getItem('postRulePos') as string)
      //     : '50%'
      // }
      // onChange={(size) => localStorage.setItem('postRulePos', String(size))}
    >
      <div className="h-full">
        <PostLayout moderated/>
      </div>
      <div className="h-full">
        <RuleLayout />
      </div>
      <div className="h-full">
        <PostLayout/>
      </div>
    </HomeSplitPane>
  );
}

const HomeSplitPane = styled(SplitPane)`
  height: 100vh;
  .Resizer.vertical {
    width: 0.3rem;
    background-color: ${palette.blue[2]};
    cursor: col-resize;
    z-index: 100;
  }
`;

export default HomeLayout;
