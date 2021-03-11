import { Button } from 'antd';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import {
  applySeeds,
  getPostsRefresh,
  getSpamsRefresh,
} from '../../modules/post/actions';
import { postActions, postSelector } from '../../modules/post/slice';

function FindFPFN(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const selectedSpamId = useSelector(postSelector.selectedSpamId);
  const selectedPostId = useSelector(postSelector.selectedPostId);
  const selectedId = selectedSpamId.concat(selectedPostId);
  const number = selectedId.length;

  const handleClickSeeds = () => {
    dispatch(applySeeds(selectedId))
      .then(() => {
        dispatch(postActions.splitList());
        dispatch(postActions.changeSortType('fpfn'));
        dispatch(postActions.changeSpamSortType('fpfn'));
      })
      .then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      })
    dispatch(postActions.clearSelectedSpamPostId());
    dispatch(postActions.clearSelectedPostId());
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="mr-4">
          {number <= 1 ? `${number} post selected` : `${number} posts selected`}
        </div>
        <Button
          type="primary"
          size="small"
          onClick={handleClickSeeds}
          disabled={!number}
        >
          Show FP & FN
        </Button>
      </div>
    </div>
  );
}

export default FindFPFN;
