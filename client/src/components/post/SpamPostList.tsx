import React from 'react';
import styled from 'styled-components';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch } from 'react-redux';
import { clearSelectedPostId } from '../../modules/post/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';

interface SpamPostListProps {
  spamPosts: (SpamSubmission | SpamComment)[] | null;
  selectedSpamPostId: string[];
  selectedPostId: string[];
  splitView: boolean;
}

function SpamPostList({
  spamPosts,
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
            </div>
            <div className='split-pane'>
              <div className='pane-label'>
                ▼ Not Affected by Automod
              </div>
            </div>
          </SplitPane>
        ) : (
          <>
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
