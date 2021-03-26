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
      <div className="ml-2">
        Copy and paste the <b className="text-base">sentences</b> or type your
        own <b className="text-base">sentences</b>
      </div>
      <div className="ml-2 mb-2">
        that represent the comments you want to filter below
      </div>
      <TextArea
        placeholder="Copy and paste the sentences"
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
          className="mt-2 ml-auto"
        >
          Find FP / FN
        </Button>
      </div>
    </div>
  );
}

export default FindFPFN;
