import React from 'react';
import styled from 'styled-components';
import {
  createKeyMaps,
  Rule,
  ruleSelector,
  submitCode,
} from '../../modules/rule/slice';
import { Tree } from 'antd';
import { cloneDeep } from 'lodash';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import OverlayLoading from '../common/OverlayLoading';
import {
  keysToTree,
  makeTree,
  treeToCode,
  treeToKeyMaps,
} from '../../lib/utils/tree';
import { AppDispatch } from '../..';
import { getPostsRefresh, getSpamsRefresh } from '../../modules/post/actions';

interface RuleSelectorProps {
  editables: Rule[];
  loadingRule: boolean;
}

function RuleSelector({ editables, loadingRule }: RuleSelectorProps) {
  const dispatch: AppDispatch = useDispatch();

  const treeDataOriginal = makeTree(editables);

  const onCheck = (checkedKeys: any, info: any) => {
    const treeData = cloneDeep(treeDataOriginal);
    const tree = keysToTree(treeData, [
      ...checkedKeys,
      ...info.halfCheckedKeys,
    ]);
    const code = treeToCode(tree);
    const keyMaps = treeToKeyMaps(tree);
    dispatch(submitCode(code)).then(() => {
      dispatch(getPostsRefresh());
      dispatch(getSpamsRefresh());
    });
    dispatch(createKeyMaps(keyMaps));
  };

  const clickedRuleIndex = useSelector(ruleSelector.clickedRuleIndex);

  return (
    <RuleSelectorDiv>
      {loadingRule && <OverlayLoading text="Apply Rules..." />}
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
  height: 100%;
  .words {
    display: flex;
  }
  .line {
    display: flex;
  }
  .list {
    display: flex;
  }
  .ant-tree {
    font-size: 16px;
    font-family: 'Courier';
  }
`;

export default RuleSelector;
