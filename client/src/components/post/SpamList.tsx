import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { postActions, postSelector } from '../../modules/post/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';
import OverlayLoading from '../common/OverlayLoading';
import { Spam } from '../../lib/api/modsandbox/post';
import { AppDispatch } from '../..';
import {
  getSpamsRefresh,
} from '../../modules/post/actions';
import { getMatch } from '../../lib/utils/match';
import SpamItem from './SpamItem';
import ListHeader from './ListHeader';
import BarRate from '../vis/BarRate';
import { Empty, Pagination } from 'antd';
import SpamSelected from './SpamSelected';
import { RootState } from '../../modules';

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
  const count = useSelector(postSelector.count);
  const spamPageAll = useSelector(postSelector.spamPageAll);
  const spamPageFiltered = useSelector(postSelector.spamPageFiltered);
  const spamPageUnfiltered = useSelector(postSelector.spamPageUnfiltered);
  const loadingApplySeeds = useSelector((state: RootState) => state.post.spams.applySeeds.loading);

  const handleClickBar = () => {
    dispatch(postActions.toggleSplitSpamPostList());
    dispatch(getSpamsRefresh());
  };

  return (
    <div className="relative flex flex-col h-full mx-2">
      {loadingSpam && <OverlayLoading text="Loading Posts..." />}
      {loadingRule && <OverlayLoading text="Applying Rules..." />}
      {loadingApplySeeds && <OverlayLoading text="Finding FP & FN..." />}
      <ListHeader
        list="moderated"
        name="Spam-filtered Comments"
        splitView={splitSpamList}
        tooltipText="Comments moderated by AutoModerator and human moderators"
        userImported={spamUserImported}
        span={spamSpan}
      />
      <div
        onClick={handleClickBar}
        className="cursor-pointer hover:opacity-70"
      >
        <BarRate total={count.spams.all} part={count.spams.filtered} />
      </div>
      <SpamSelected/>
      <SplitPaneDiv className="flex-1 overflow-y-auto">
        {splitView ? (
          <SplitPane
            split="horizontal"
            defaultSize="50%"
            style={{ position: 'relative' }}
            paneStyle={{ overflow: 'auto' }}
          >
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-center sticky bg-white top-0 z-10">
                ▼ Filtered by Automod
              </div>
              <div className="flex-1 overflow-auto">
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
              </div>
              <div className="m-1 justify-center items-center flex">
                <Pagination
                  current={spamPageFiltered}
                  total={count.spams.filtered}
                  onChange={(page) => {
                    dispatch(postActions.getFilteredSpams(page));
                  }}
                  pageSize={20}
                  simple
                />
              </div>
            </div>
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-center sticky bg-white top-0 z-10">
                ▼ Not Filtered by Automod
              </div>
              <div className="flex-1 overflow-auto">
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
              </div>
              <div className="m-1 justify-center items-center flex">
                <Pagination
                  current={spamPageUnfiltered}
                  total={count.spams.unfiltered}
                  onChange={(page) => {
                    dispatch(postActions.getUnfilteredSpams(page));
                  }}
                  pageSize={20}
                  simple
                />
              </div>
            </div>
          </SplitPane>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-auto">
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
            </div>
            <div className="m-1 justify-center items-center flex">
              <Pagination
                current={spamPageAll}
                total={count.spams.all}
                onChange={(page) => {
                  dispatch(postActions.getAllSpams(page));
                }}
                pageSize={20}
                simple
              />
            </div>
          </div>
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
