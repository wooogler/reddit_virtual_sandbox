import request from '@utils/request';
import { useStore } from '@utils/store';
import { AxiosError } from 'axios';
import React, { ReactElement } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

interface Confusion {
  rule_1: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
  };
  rule_2: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
  };
}

function ConfusionMatrix(): ReactElement {
  const { config_id } = useStore();
  const { data: confusionData } = useQuery<Confusion, AxiosError>(
    ['confusion', { config_id }],
    async () => {
      const { data } = await request<Confusion>({
        url: '/eval/confusion/',
        params: {
          config_id,
        },
      });
      return data;
    }
  );

  return (
    <TableDiv className='flex'>
      <table className='table-auto border border-collapse'>
        <tbody>
          <tr>
            <td>rule 1</td>
            <td>AutoMod Yes</td>
            <td>AutoMod No</td>
          </tr>
          <tr>
            <td>Actual Yes</td>
            <td>{confusionData?.rule_1.tp}</td>
            <td>{confusionData?.rule_1.fn}</td>
          </tr>
          <tr>
            <td>Actual No</td>
            <td>{confusionData?.rule_1.fp}</td>
            <td>{confusionData?.rule_1.tn}</td>
          </tr>
        </tbody>
      </table>
      <table className='table-auto border border-collapse ml-2'>
        <tbody>
          <tr>
            <td>rule 2</td>
            <td>AutoMod Yes</td>
            <td>AutoMod No</td>
          </tr>
          <tr>
            <td>Actual Yes</td>
            <td>{confusionData?.rule_2.tp}</td>
            <td>{confusionData?.rule_2.fn}</td>
          </tr>
          <tr>
            <td>Actual No</td>
            <td>{confusionData?.rule_2.fp}</td>
            <td>{confusionData?.rule_2.tn}</td>
          </tr>
        </tbody>
      </table>
    </TableDiv>
  );
}

const TableDiv = styled.div`
  td {
    border: 1px solid gray;
    padding: 0px 0.5rem;
  }
`;

export default ConfusionMatrix;
