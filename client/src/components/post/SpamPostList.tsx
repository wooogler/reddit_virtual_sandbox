import React from 'react';
import styled from 'styled-components';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import OverlayWithButton from '../common/OverlayWithButton';
import SpamPostItem from './SpamPostItem';
import { useDispatch } from 'react-redux';
import { clearSelectedPostId } from '../../modules/post/slice';
import SplitPane from 'react-split-pane';
import { Line } from '../../modules/rule/slice';
import palette from '../../lib/styles/palette';

interface SpamPostListProps {
  spamPosts: (SpamSubmission | SpamComment)[] | null;
  selectedLines: Omit<Line, 'content'>[];
  selectedSpamPostId: string[];
  selectedPostId: string[];
  splitView: boolean;
}

function SpamPostList({
  spamPosts,
  selectedLines,
  selectedSpamPostId,
  selectedPostId,
  splitView,
}: SpamPostListProps) {
  const dispatch = useDispatch();

  const handleClickMove = () => {
    alert(JSON.stringify(selectedPostId));
    dispatch(clearSelectedPostId());
  };

  const handleClickDelete = () => {
    alert(JSON.stringify(selectedPostId));
    dispatch(clearSelectedPostId());
  };

  const labeledSpamPosts = spamPosts?.map((post) => {
    const isFiltered =
      selectedLines.length === 0
        ? false
        : selectedLines.every((item) =>
            post.matching_rules.includes(`${item.ruleId}-${item.lineId}`),
          );
    const selected = selectedSpamPostId.includes(post._id);
    return { post, isFiltered, selected };
  });

  return (
    <SpamPostListBlock>
      {selectedPostId.length !== 0 && (
        <OverlayWithButton
          text="Move to Moderated"
          buttonText1="Move"
          onClickButton1={handleClickMove}
          buttonText2='Delete'
          onClickButton2={handleClickDelete}
        />
      )}
      <div className="list">
        {splitView ? (
          <SplitPane
            split="horizontal"
            defaultSize="50%"
            style={{ position: 'relative' }}
            paneStyle={{ overflow: 'auto', width: '100%' }}
          >
            <div className='split-pane'>
              <div className='pane-label'>
                ▼ Affected by Automod
              </div>
              {labeledSpamPosts
                ?.filter((item) => item.isFiltered)
                .map((item) => {
                  const { post, isFiltered, selected } = item;
                  return (
                    <SpamPostItem
                      spamPost={post}
                      action={isFiltered ? 'remove' : undefined}
                      key={post._id}
                      selected={selected}
                    />
                  );
                })}
            </div>
            <div className='split-pane'>
              <div className='pane-label'>
                ▼ Not Affected by Automod
              </div>
              {labeledSpamPosts
                ?.filter((item) => !item.isFiltered)
                .map((item) => {
                  const { post, isFiltered, selected } = item;
                  return (
                    <SpamPostItem
                      spamPost={post}
                      action={isFiltered ? 'remove' : undefined}
                      key={post._id}
                      selected={selected}
                    />
                  );
                })}
            </div>
          </SplitPane>
        ) : (
          <>
            {labeledSpamPosts?.map((item) => {
              const { post, isFiltered, selected } = item;
              return (
                <SpamPostItem
                  spamPost={post}
                  action={isFiltered ? 'remove' : undefined}
                  key={post._id}
                  selected={selected}
                />
              );
            })}
          </>
        )}
      </div>
    </SpamPostListBlock>
  );
}

const SpamPostListBlock = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
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
`;

export default SpamPostList;
