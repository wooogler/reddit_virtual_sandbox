import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import Tour, { ReactourStep } from 'reactour';
import styled from 'styled-components';
import { AppDispatch } from '..';
import PostLayout from '../components/post/PostLayout';
import RuleLayout from '../components/rule/RuleLayout';
import {
  getPostsRefresh,
  getSpamsRefresh,
  importTestData,
} from '../modules/post/actions';
import { postSelector } from '../modules/post/slice';
import { submitCode } from '../modules/rule/slice';

const steps: ReactourStep[] = [
  {
    selector: '[data-tour="step-spamlist"]',
    content: () => (
      <>
        <div>You can see the manually moderated posts here.</div>
        <div>Let's assume that you want to filter the posts about <b>Asian hate</b>,</div>
      </>
    ),
  },
  {
    selector: '[data-tour="step-postlist"]',
    content: 'You can see the posts in Subreddit here',
  },
  {
    selector: '[data-tour="step-rule"]',
    content: 'You can create a keyword filter.',
    position: 'bottom',
  },
  {
    selector: '[data-tour="step-editor"]',
    content: () => (
      <div>
        Please type <code className="bg-gray-300 p-1">body: ['hello']</code> to
        filter the posts with 'hello'
      </div>
    ),
    position: 'bottom',
  },
  {
    selector: '[data-tour="step-run"]',
    content:
      'click "Run" to apply your configuration, please go next when the button changes into Edit',
  },
  {
    selector: '[data-tour="step-postlist"]',
    content: 'You can check filtered posts and not filtered posts here',
  },

  {
    selector: '[data-tour="step-filtered"]',
    content: 'Here you can see the posts filtered by your configuration',
  },
  {
    selector: '[data-tour="step-unfiltered"]',
    content: 'Here you can see the posts not filtered by your configuration',
  },
  {
    selector: '[data-tour="step-bar"]',
    content: 'You can check how many posts are filtered by your configuration',
  },
];

function HomePage() {
  const dispatch: AppDispatch = useDispatch();
  const countPostAll = useSelector(postSelector.count).posts.all;
  const [isTourOpen, setIsTourOpen] = useState(true);
  useEffect(() => {
    if (countPostAll === 0) {
      dispatch(importTestData()).then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      });
    }
  }, [dispatch, countPostAll]);
  useEffect(() => {
    dispatch(submitCode({ code: '', multiple: false })).then(() => {
      dispatch(getPostsRefresh());
      dispatch(getSpamsRefresh());
    });
  }, [dispatch]);

  return (
    <>
      <HomeSplitPane
      split="vertical"
    >
      <div className="h-full" data-tour="step-spamlist">
        <PostLayout moderated />
      </div>
      <div className="h-full">
        <RuleLayout />
      </div>
      <div className="h-full" data-tour="step-postlist">
        <PostLayout />
      </div>
    </HomeSplitPane>
      {/* <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        disableFocusLock={true}
      /> */}
    </>
  );
}

const HomeSplitPane = styled(SplitPane)`
  height: 100vh;
`;

export default HomePage;
