import { Button, InputNumber, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { ReactElement, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import { RootState } from '../../modules';
import { notFilter } from '../../modules/stat/actions';

interface Props {
  
}

const columns: ColumnsType<any> = [
  {
    title: 'Word',
    dataIndex: 'word',
  },
  {
    title: 'Target Frequency',
    dataIndex: 'target_freq',
    sortDirections: ['ascend', 'descend', 'ascend'],
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.target_freq - b.target_freq,
  },
  {
    title: 'Non Target Frequency',
    dataIndex: 'non_target_freq',
    sortDirections: ['ascend', 'descend', 'ascend'],
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.non_target_freq - b.non_target_freq,
  },
];

function NotFilter({}: Props): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(
    (state: RootState) => state.stat.notFilter.loading,
  );

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10);

  const recommends = useSelector((state: RootState) => state.stat.notFilter.data)
    .map((item, index) => {
      return { ...item, key: index };
    })
    .filter(
      (item) => item.non_target_freq <= max && item.non_target_freq >= min,
    );

  const handleClickRecommend = () => {
    dispatch(notFilter());
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-3 justify-center">
        <Button type="primary" size="small" onClick={handleClickRecommend}>
          Recommend keywords for NOT filter
        </Button>
        <div className="flex">
          <div className="ml-5 mr-2">range:</div>
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
      </div>

      <Table
        pagination={{ pageSize: 20, showSizeChanger: false }}
        columns={columns}
        dataSource={recommends}
        size="small"
        loading={loading}
        scroll={{ y: 200 }}
      />
    </div>
  );
}

export default NotFilter
