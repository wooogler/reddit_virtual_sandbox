import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Variation } from '../../lib/api/modsandbox/post';
import { RootState } from '../../modules';

interface Props {
  wordVariation: Variation[];
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
  {
    title: 'Similarity',
    dataIndex: 'sim',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.sim - b.sim,
  },
];

function WordVariationTable({ wordVariation }: Props): ReactElement {
  const loading = useSelector((state: RootState) => state.post.posts.wordVariation.loading);

  const wordVariationWithKey = wordVariation.map((item, index) => {
    return { key: index, ...item };
  });
  return <Table columns={columns} dataSource={wordVariationWithKey} size="small" loading={loading}/>;
}

export default WordVariationTable;
