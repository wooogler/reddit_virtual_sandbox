import { Table, Input, Slider, InputNumber } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import _ from 'lodash';
import React, { ReactElement, useState } from 'react';
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
    title: 'Frequency',
    dataIndex: 'post_freq',
  },
  {
    title: 'Similarity',
    dataIndex: 'sim',
  },
];

function WordVariationTable({ wordVar }: Props): ReactElement {
  const dispatch = useDispatch();

  const loading = useSelector(
    (state: RootState) => state.stat.wordVariation.loading,
  );

  const wordVariationWithKey = [...wordVar]
    .sort((a, b) => b.sim - a.sim)
    .map((item, index) => {
      return { ...item, key: index, sim: item.sim.toFixed(2) };
    });

  const onSearch = (value: string) => {
    dispatch(wordVariation(value));
  };

  const [min, setMin] = useState(2);
  const [max, setMax] = useState(100);

  const tableData = () => {
    if (max && min) {
      return wordVariationWithKey
        .filter((item) => item.post_freq <= max && item.post_freq >= min)
        .slice(0, 100);
    }
    return [];
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-2">
        <Search
          placeholder="type a keyword"
          onSearch={onSearch}
          className="flex-1"
          size="small"
        />
        <div className="flex-1 flex items-center">
          {wordVar.length !== 0 && (
            <div className='flex ml-auto'>
              <div className="ml-5 mr-2">Frequency range:</div>
              <InputNumber
                className="w-10"
                size="small"
                value={min}
                onChange={(value) => setMin(value as number)}
              />
              <div className="mx-2">-</div>
              <InputNumber
                className="w-10"
                size="small"
                value={max}
                onChange={(value) => setMax(value as number)}
              />
            </div>
          )}
        </div>
      </div>

      <Table
        pagination={{ pageSize: 20, showSizeChanger: false }}
        columns={columns}
        dataSource={tableData()}
        size="small"
        loading={loading}
        scroll={{y: 200}}
      />
    </div>
  );
}

export default WordVariationTable;
