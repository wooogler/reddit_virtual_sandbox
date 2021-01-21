import React, { useState } from 'react';
import styled from 'styled-components';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch } from 'react-redux';
import { postActions } from '../../modules/post/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';
import { useInfiniteScroll } from '../../lib/hooks';
import OverlayLoading from '../common/OverlayLoading';
import { Spam } from '../../lib/api/modsandbox/post';
import { AppDispatch } from '../..';
import { deletePosts, getPostsRefresh, getSpamsRefresh, movePosts } from '../../modules/post/actions';
import { getMatch } from '../../lib/utils/match';
import SpamItem from './SpamItem';

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
  listHeaderHeight: number;
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
  listHeaderHeight,
}: SpamListProps) {
  const dispatch: AppDispatch = useDispatch();
  const [target, setTarget] = useState<any>(null);
  
  useInfiniteScroll({
    target,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if(target.className === 'last-item-all') {
          dispatch(postActions.getAllSpamsMore());
        }
        if(target.className === 'last-item-filtered') {
          dispatch(postActions.getFilteredSpamsMore());
        }
        if(target.className === 'last-item-unfiltered') {
          dispatch(postActions.getUnfilteredSpamsMore());
        }
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
      dispatch(getPostsRefresh())
    });
    dispatch(postActions.clearSelectedPostId());
  };

  return (
    <SpamPostListBlock listHeaderHeight={listHeaderHeight}>
      {selectedPostId.length !== 0 && (
        <OverlayWithButton
          text={selectedPostId.length ===1 ? `1 post selected` : `${selectedPostId.length} posts selected`}
          buttonText1="Move to Seed posts"
          onClickButton1={handleClickMove}
          buttonText2='Delete from Posts'
          onClickButton2={handleClickDelete}
        />
      )}
      {loadingSpam && <OverlayLoading text="Loading Posts..." />}
      {loadingRule && <OverlayLoading text="Applying Rules..." />}
      <div className="list">
        {splitView ? (
          <SplitPane
            split="horizontal"
            defaultSize="50%"
            style={{ position: 'relative' }}
            paneStyle={{ overflow: 'auto' }}
          >
            <div className='split-pane'>
              <div className='pane-label'>
                ▼ Affected by Automod
              </div>
              {
                spamsFiltered.map((spam) => {
                  return (<SpamItem
                    spam={spam}
                    selected={selectedSpamId.includes(spam._id)}
                    isMatched={spam.matching_rules.length !== 0}
                    match={getMatch(code, spam)}
                    key={spam._id}
                  />)
                })
              }
              {
                spamsFiltered.length > 8 && (
                  <div ref={setTarget} className="last-item-filtered"></div>
                )
              }
            </div>
            <div className='split-pane'>
              <div className='pane-label'>
                ▼ Not Affected by Automod
              </div>
              {
                spamsUnfiltered.map((spam) => {
                  return (<SpamItem
                    spam={spam}
                    selected={selectedSpamId.includes(spam._id)}
                    isMatched={spam.matching_rules.length !== 0}
                    match={getMatch(code, spam)}
                    key={spam._id}
                  />)
                })
              }
              {
                spamsUnfiltered.length > 8 && (
                  <div ref={setTarget} className="last-item-unfiltered"></div>
                )
              }
            </div>
          </SplitPane>
        ) : (
          <>
            {spamsAll.map((spam) => {
              return (<SpamItem
                spam={spam}
                selected={selectedSpamId.includes(spam._id)}
                isMatched={spam.matching_rules.length !== 0}
                match={getMatch(code, spam)}
                key={spam._id}
              />)
            })}
            {spamsAll.length > 8 && (
              <div ref={setTarget} className="last-item-all"></div>
            )}
          </>
        )}
      </div>
    </SpamPostListBlock>
  );
}

const SpamPostListBlock = styled.div<{listHeaderHeight: number}>`
  display: flex;
  flex-direction: column;
  height: calc(100% - ${(props) => props.listHeaderHeight}px);
  .list {
    height: 100%;
    overflow-y: auto;
    .split-pane {
      width: 100%;
      .pane-label {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 0.3rem;
        border-bottom: 0.1rem solid ${palette.gray[2]};
        font-size: 0.9rem;
        color: ${palette.gray[7]}
      }
    }
  }
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
