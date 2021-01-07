import React from 'react';
import styled from 'styled-components';
import { Rule, ruleSelector, submitCode } from '../../modules/rule/slice';
import { Tree } from 'antd';
import { cloneDeep } from 'lodash';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import OverlayLoading from '../common/OverlayLoading';
import { keysToTree, makeTree, treeToCode } from '../../lib/utils/tree';
import { AppDispatch } from '../..';
import { getPostsRefresh, getSpamsRefresh } from '../../modules/post/actions';

interface RuleSelectorProps {
  editables: Rule[];
  loadingRule: boolean;
}

type Tree = {
  title: string;
  key: string;
  children: {
    title: string;
    key: string;
    children: {
      title: string;
      key: string;
    }[];
  }[];
}[];

function RuleSelector({ editables, loadingRule }: RuleSelectorProps) {
  const dispatch: AppDispatch = useDispatch();

  const treeDataOriginal = makeTree(editables)

  const onCheck = (checkedKeys: any, info: any) => {
    const treeData = cloneDeep(treeDataOriginal);
    const code = treeToCode(
      keysToTree(treeData, [...checkedKeys, ...info.halfCheckedKeys]),
    );
    dispatch(submitCode(code)).then(() => {
      dispatch(getPostsRefresh());
      dispatch(getSpamsRefresh());
    })
  };

  const clickedRuleIndex = useSelector(ruleSelector.clickedRuleIndex)

  return (
    <RuleSelectorDiv>
      {loadingRule && <OverlayLoading text='Apply Rules...' />}
      <Tree
        checkable
        onCheck={onCheck}
        treeData={treeDataOriginal}
        defaultExpandAll={true}
        selectedKeys={[clickedRuleIndex]}
      />
    </RuleSelectorDiv>
  );
}

const RuleSelectorDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: 'Courier';
  height: 100%;
  font-size: 16px;
  .words {
    display: flex;
  }
  .line {
    display: flex;
  }
  .list {
    display: flex;
  }
`;

export default RuleSelector;
