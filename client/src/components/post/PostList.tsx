import React from 'react';
import styled from 'styled-components';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch, useSelector } from 'react-redux';
import { postActions, postSelector } from '../../modules/post/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';
import { Post } from '../../lib/api/modsandbox/post';
import OverlayLoading from '../common/OverlayLoading';
import {
  applySeeds,
  deleteSpams,
  getPostsRefresh,
  getSpamsRefresh,
  moveSpams,
} from '../../modules/post/actions';
import { AppDispatch } from '../..';
import PostItem from './PostItem';
import { getMatch } from '../../lib/utils/match';
import ListHeader from './ListHeader';
import BarRate from '../vis/BarRate';
import { Empty, Pagination } from 'antd';
import { changeTool } from '../../modules/rule/slice';
import { wordFrequency } from '../../modules/stat/actions';

interface PostListProps {
  postsAll: Post[];
  postsFiltered: Post[];
  postsUnfiltered: Post[];
  selectedSpamPostId: string[];
  selectedPostId: string[];
  splitView: boolean;
  loadingPost: boolean;
  loadingRule: boolean;
  loadingImport: boolean;
  code: string;
  splitPostList: boolean;
  postUserImported: boolean;
  postSpan: boolean;
}

function PostList({
  postsAll,
  postsFiltered,
  postsUnfiltered,
  selectedSpamPostId,
  selectedPostId,
  splitView,
  loadingPost,
  loadingRule,
  code,
  splitPostList,
  postUserImported,
  postSpan,
}: PostListProps) {
  const dispatch: AppDispatch = useDispatch();
  const count = useSelector(postSelector.count);
  const pageAll = useSelector(postSelector.pageAll);
  const pageFiltered = useSelector(postSelector.pageFiltered);
  const pageUnfiltered = useSelector(postSelector.pageUnfiltered);

  const handleClickMove = () => {
    dispatch(moveSpams(selectedSpamPostId)).then(() => {
      dispatch(getSpamsRefresh());
      dispatch(getPostsRefresh());
    });
    dispatch(postActions.clearSelectedSpamPostId());
  };

  const handleClickDelete = () => {
    dispatch(deleteSpams(selectedSpamPostId)).then(() => {
      dispatch(getSpamsRefresh());
    });
    dispatch(postActions.clearSelectedSpamPostId());
  };

  const handleClickSeeds = () => {
    dispatch(applySeeds(selectedSpamPostId)).then(() => {
      dispatch(getSpamsRefresh());
    });
    dispatch(postActions.clearSelectedSpamPostId());
  };

  const handleClickFreq = () => {
    dispatch(wordFrequency(selectedSpamPostId)).then(() => {
      dispatch(getSpamsRefresh());
    })
    dispatch(postActions.clearSelectedSpamPostId());
    dispatch(changeTool('freq'));
  }

  const handleClickBar = () => {
    dispatch(postActions.toggleSplitPostList());
    dispatch(getPostsRefresh());
  };

  

  return (
    <div className="relative flex flex-col h-full mx-2">
      {selectedSpamPostId.length !== 0 && (
        <OverlayWithButton
          text={
            selectedSpamPostId.length === 1
              ? `1 post selected`
              : `${selectedSpamPostId.length} posts selected`
          }
          buttonText1="Move to Posts"
          onClickButton1={handleClickMove}
          buttonText2="Delete posts"
          onClickButton2={handleClickDelete}
          buttonText3="Apply as seeds"
          onClickButton3={handleClickSeeds}
          buttonText4='Keyword frequency'
          onClickButton4={handleClickFreq}
        />
      )}
      {loadingPost && <OverlayLoading text="Loading Posts..." />}
      {loadingRule && <OverlayLoading text="Applying Rules..." />}
      <ListHeader
        list="unmoderated"
        name="Posts"
        splitView={splitPostList}
        tooltipText="Posts imported from real subreddit"
        userImported={postUserImported}
        span={postSpan}
      />
      <div
        onClick={handleClickBar}
        className="cursor-pointer hover:opacity-70 mb-2"
      >
        <BarRate total={count.posts.all} part={count.posts.filtered} />
      </div>
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
                {postsFiltered.length !== 0 ? (
                  postsFiltered.map((post) => {
                    return (
                      <PostItem
                        post={post}
                        selected={selectedPostId.includes(post._id)}
                        isMatched={post.matching_rules.length !== 0}
                        match={getMatch(code, post)}
                        key={post._id}
                      />
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Empty description="No filtered post" />
                  </div>
                )}
              </div>
              <div className="m-1 justify-center items-center flex">
                <Pagination
                  current={pageFiltered}
                  total={count.posts.filtered}
                  onChange={(page) => {
                    dispatch(postActions.getFilteredPosts(page));
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
                {postsUnfiltered.length !== 0 ? (
                  postsUnfiltered.map((post) => {
                    return (
                      <PostItem
                        post={post}
                        selected={selectedPostId.includes(post._id)}
                        isMatched={post.matching_rules.length !== 0}
                        match={getMatch(code, post)}
                        key={post._id}
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
                  current={pageUnfiltered}
                  total={count.posts.unfiltered}
                  onChange={(page) => {
                    dispatch(postActions.getUnfilteredPosts(page));
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
              {postsAll.length !== 0 ? (
                postsAll.map((post) => {
                  return (
                    <PostItem
                      post={post}
                      selected={selectedPostId.includes(post._id)}
                      isMatched={post.matching_rules.length !== 0}
                      match={getMatch(code, post)}
                      key={post._id}
                    />
                  );
                })
              ) : (
                <div className="flex justify-center items-center flex-1">
                  <Empty description="Import subreddit posts" />
                </div>
              )}
            </div>
            <div className="m-1 justify-center items-center flex">
              <Pagination
                current={pageAll}
                total={count.posts.all}
                onChange={(page) => {
                  dispatch(postActions.getAllPosts(page));
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
    z-index: 1;
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

export default PostList;
