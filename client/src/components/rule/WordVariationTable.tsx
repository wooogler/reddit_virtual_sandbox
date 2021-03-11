import { Table, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Variation } from '../../lib/api/modsandbox/post';
import { RootState } from '../../modules';
import { wordVariation } from '../../modules/stat/actions';

const { Search } = Input;

interface Props {
  wordVar: Variation[];
}

const columns: ColumnsType<any> = [
  {
    title: 'Word',
    dataIndex: 'word',
  },
  {
    title: 'Post Frequency',
    dataIndex: 'post_freq',
    sorter: (a, b) => a.freq - b.freq,
  },
  {
    title: 'Target Frequency',
    dataIndex: 'spam_freq',
    sorter: (a, b) => a.freq - b.freq,
  },
  {
    title: 'Similarity',
    dataIndex: 'sim',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.sim - b.sim,
  },
];

function WordVariationTable({ wordVar }: Props): ReactElement {
  const dispatch = useDispatch();
  const loading = useSelector(
    (state: RootState) => state.stat.wordVariation.loading,
  );

  const wordVariationWithKey = wordVar.map((item, index) => {
    return { ...item, key: index, sim: item.sim.toFixed(2) };
  });

  const onSearch = (value: string) => {
    dispatch(wordVariation(value));
  };
  return (
    <div className="flex flex-col">
      <Search
        placeholder="type a keyword"
        onSearch={onSearch}
        className="mb-3 w-60"
      />
      <Table
        pagination={{ pageSize: 5, showSizeChanger: false }}
        columns={columns}
        dataSource={wordVariationWithKey}
        size="small"
        loading={loading}
      />
    </div>
  );
}

export default WordVariationTable;
