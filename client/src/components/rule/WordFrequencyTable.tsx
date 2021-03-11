import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import { Frequency } from '../../lib/api/modsandbox/post';
import { RootState } from '../../modules';
import { postSelector } from '../../modules/post/slice';
import { changeTool } from '../../modules/rule/slice';
import { wordFrequency } from '../../modules/stat/actions';

interface Props {
  wordFreq: Frequency[];
}

const columns: ColumnsType<any> = [
  {
    title: 'Word',
    dataIndex: 'word',
  },
  {
    title: 'Frequency',
    dataIndex: 'freq',
    sortDirections: ['ascend', 'descend', 'ascend'],
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.freq - b.freq,
  },
];

function WordFrequencyTable({ wordFreq }: Props): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(
    (state: RootState) => state.stat.wordFrequency.loading,
  );
  const wordFrequencyWithKey = wordFreq.map((item, index) => {
    return { ...item, key: index };
  });
  const selectedSpamId = useSelector(postSelector.selectedSpamId);
  const selectedPostId = useSelector(postSelector.selectedPostId);
  const selectedId = selectedSpamId.concat(selectedPostId);
  const number = selectedId.length;

  const handleClickFreq = () => {
    dispatch(wordFrequency(selectedId));
    dispatch(changeTool('freq'));
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-3">
        <div className="mr-4">
          {number <= 1 ? `${number} post selected` : `${number} posts selected`}
        </div>
        <Button
          type="primary"
          size="small"
          onClick={handleClickFreq}
          disabled={!number}
        >
          Analyze the frequency
        </Button>
      </div>

      <Table
        pagination={{ pageSize: 5, showSizeChanger: false }}
        columns={columns}
        dataSource={wordFrequencyWithKey}
        size="small"
        loading={loading}
      />
    </div>
  );
}

export default WordFrequencyTable;
