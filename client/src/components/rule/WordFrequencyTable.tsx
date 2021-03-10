import Table, { ColumnsType } from 'antd/lib/table';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { WordFreq } from '../../lib/api/modsandbox/post';
import { RootState } from '../../modules';

interface Props {
  wordFreq: WordFreq[];
}

const columns: ColumnsType<any> = [
  {
    title: 'Word',
    dataIndex: 'word',
  },
  {
    title: 'Document Frequency',
    dataIndex: 'freq',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.freq - b.freq,
  },
];

function WordFrequencyTable({ wordFreq }: Props): ReactElement {
  const loading = useSelector(
    (state: RootState) => state.post.spams.wordFrequency.loading,
  );
  const wordFrequencyWithKey = wordFreq.map((item, index) => {
    return { ...item, key: index };
  });

  return (
    <div className="flex flex-col">
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
