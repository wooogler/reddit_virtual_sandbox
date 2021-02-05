import React, { useState } from 'react';
import styled from 'styled-components';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch, useSelector } from 'react-redux';
import { postActions, postSelector } from '../../modules/post/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';
import { useInfiniteScroll } from '../../lib/hooks';
import OverlayLoading from '../common/OverlayLoading';
import { Spam } from '../../lib/api/modsandbox/post';
import { AppDispatch } from '../..';
import {
  deletePosts,
  getPostsRefresh,
  getSpamsRefresh,
  movePosts,
} from '../../modules/post/actions';
import { getMatch } from '../../lib/utils/match';
import SpamItem from './SpamItem';
import ListHeader from './ListHeader';
import BarRate from '../vis/BarRate';
import { Empty } from 'antd';

interface SpamListProps {
  spamsAll: Spam[];
  spamsFiltered: Spam[];
  spamsUnfiltered: Spam[];
  selectedPostId: string[];
  selectedSpamId: string[];
  splitView: boolean;
  loadingSpam: boolean;
  loadingRule: boolean;
  loadingSpamImport: boolean;
  code: string;
  splitSpamList: boolean;
  spamUserImported: boolean;
  spamSpan: boolean;
}

function SpamList({
  spamsAll,
  spamsFiltered,
  spamsUnfiltered,
  selectedPostId,
  selectedSpamId,
  splitView,
  loadingSpam,
  loadingRule,
  code,
  splitSpamList,
  spamUserImported,
  spamSpan,
}: SpamListProps) {
  const dispatch: AppDispatch = useDispatch();
  const [targetAll, setTargetAll] = useState<any>(null);
  const [targetFiltered, setTargetFiltered] = useState<any>(null);
  const [targetUnfiltered, setTargetUnfiltered] = useState<any>(null);
  const count = useSelector(postSelector.count);

  useInfiniteScroll({
    target: targetAll,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting) {
        dispatch(postActions.getAllSpamsMore());
      }
    },
    threshold: 0.7,
  });
  useInfiniteScroll({
    target: targetFiltered,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting) {
        dispatch(postActions.getFilteredSpamsMore());
      }
    },
    threshold: 0.7,
  });
  useInfiniteScroll({
    target: targetUnfiltered,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting) {
        dispatch(postActions.getUnfilteredSpamsMore());
      }
    },
    threshold: 0.7,
  });

  const handleClickMove = () => {
    dispatch(movePosts(selectedPostId)).then(() => {
      dispatch(getPostsRefresh());
      dispatch(getSpamsRefresh());
    });
    dispatch(postActions.clearSelectedPostId());
  };

  const handleClickDelete = () => {
    dispatch(deletePosts(selectedPostId)).then(() => {
      dispatch(getPostsRefresh());
    });
    dispatch(postActions.clearSelectedPostId());
  };

  const handleClickBar = () => {
    dispatch(postActions.toggleSplitSpamPostList());
    dispatch(getSpamsRefresh());
  };

  return (
    <div className="relative flex flex-col h-full mx-2">
      {selectedPostId.length !== 0 && (
        <OverlayWithButton
          text={
            selectedPostId.length === 1
              ? `1 post selected`
              : `${selectedPostId.length} posts selected`
          }
          buttonText1="Move to Seed posts"
          onClickButton1={handleClickMove}
          buttonText2="Delete from Posts"
          onClickButton2={handleClickDelete}
        />
      )}
      {loadingSpam && <OverlayLoading text="Loading Posts..." />}
      {loadingRule && <OverlayLoading text="Applying Rules..." />}
      <ListHeader
        list="moderated"
        name="Moderated"
        splitView={splitSpamList}
        tooltipText="Moderated posts from spam, reports, mod queue in your subreddit"
        userImported={spamUserImported}
        span={spamSpan}
      />
      <div onClick={handleClickBar} className="cursor-pointer hover:opacity-70  mb-2">
        <BarRate total={count.spams.all} part={count.spams.filtered} />
      </div>
      <SplitPaneDiv className="flex-1 overflow-y-auto">
        {splitView ? (
          <SplitPane
            split="horizontal"
            defaultSize="50%"
            style={{ position: 'relative' }}
            paneStyle={{ overflow: 'auto' }}
          >
            <div className="w-full">
              <div className="flex justify-center sticky bg-white top-0 z-10">
                ▼ Filtered by Automod
              </div>
              {spamsFiltered.length !== 0 ? (
                spamsFiltered.map((spam) => {
                  return (
                    <SpamItem
                      spam={spam}
                      selected={selectedSpamId.includes(spam._id)}
                      isMatched={spam.matching_rules.length !== 0}
                      match={getMatch(code, spam)}
                      key={spam._id}
                    />
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-full">
                  <Empty description="No unfiltered spam" />
                </div>
              )}
              {spamsFiltered.length > 8 && (
                <div
                  ref={setTargetFiltered}
                  className="last-item-filtered"
                ></div>
              )}
            </div>
            <div className="w-full h-full">
              <div className="flex justify-center sticky bg-white top-0 z-10">
                ▼ Not Filtered by Automod
              </div>
              {spamsUnfiltered.length !== 0 ? (
                spamsUnfiltered.map((spam) => {
                  return (
                    <SpamItem
                      spam={spam}
                      selected={selectedSpamId.includes(spam._id)}
                      isMatched={spam.matching_rules.length !== 0}
                      match={getMatch(code, spam)}
                      key={spam._id}
                    />
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-full">
                  <Empty description="No unfiltered post" />
                </div>
              )}
              {spamsUnfiltered.length > 8 && (
                <div
                  ref={setTargetUnfiltered}
                  className="last-item-unfiltered"
                ></div>
              )}
            </div>
          </SplitPane>
        ) : (
          <>
            {spamsAll.length !== 0 ? (
              spamsAll.map((spam) => {
                return (
                  <SpamItem
                    spam={spam}
                    selected={selectedSpamId.includes(spam._id)}
                    isMatched={spam.matching_rules.length !== 0}
                    match={getMatch(code, spam)}
                    key={spam._id}
                  />
                );
              })
            ) : (
              <div className="flex justify-center items-center h-full">
                <Empty description="Import moderated posts" />
              </div>
            )}
            {spamsAll.length > 8 && (
              <div ref={setTargetAll} className="last-item-all"></div>
            )}
          </>
        )}
      </SplitPaneDiv>
    </div>
  );
}

const SplitPaneDiv = styled.div`
  .Resizer.horizontal {
    height: 0.3rem;
    background-color: ${palette.blue[2]};
    cursor: row-resize;
    width: 100%;
    z-index: 100;
  }
  .last-item-all {
    width: 100%;
    height: 100px;
  }
  .last-item-filtered {
    width: 100%;
    height: 100px;
  }
  .last-item-unfiltered {
    width: 100%;
    height: 100px;
  }
`;

export default SpamList;
