import { Button, Input } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import {
  applySeed,
  applySeeds,
  getPostsRefresh,
  getSpamsRefresh,
} from '../../modules/post/actions';
import { postActions, postSelector } from '../../modules/post/slice';

const { TextArea } = Input;

function FindFPFN(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const selectedSpamId = useSelector(postSelector.selectedSpamId);
  const selectedPostId = useSelector(postSelector.selectedPostId);
  const [seed, setSeed] = useState('');
  const selectedId = selectedSpamId.concat(selectedPostId);
  const number = selectedId.length;

  const handleClickSeed = () => {
    dispatch(applySeed(seed))
      .then(() => {
        dispatch(postActions.splitList());
        dispatch(postActions.changeSortType('fpfn'));
        dispatch(postActions.changeSpamSortType('fpfn'));
      })
      .then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      });
    dispatch(postActions.clearSelectedSpamPostId());
    dispatch(postActions.clearSelectedPostId());
  };
  return (
    <div className="flex flex-col">
      <TextArea
        placeholder="type a sentence to calculate similarity"
        rows={4}
        onChange={(e) => setSeed(e.target.value)}
        value={seed}
      />
      <div className="flex items-center">
        {/* <div className="mr-4">
          {number <= 1 ? `${number} post selected` : `${number} posts selected`}
        </div> */}
        <Button
          type="primary"
          size="small"
          onClick={handleClickSeed}
          // disabled={!number}
        >
          Calculate Similarity
        </Button>
      </div>
    </div>
  );
}

export default FindFPFN;
