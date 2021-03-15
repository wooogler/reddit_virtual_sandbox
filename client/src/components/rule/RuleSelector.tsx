import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  createKeyMaps,
  Rule,
  ruleSelector,
  submitCode,
} from '../../modules/rule/slice';
import { notification, Tree } from 'antd';
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
import {
  getPostsRefresh,
  getSpamsRefresh,
} from '../../modules/post/actions';
import { RootState } from '../../modules';

interface RuleSelectorProps {
  editables: Rule[];
  loadingRule: boolean;
}

function RuleSelector({ editables, loadingRule }: RuleSelectorProps) {
  const dispatch: AppDispatch = useDispatch();
  const ruleState = useSelector((state: RootState) => state.rule);
  const error = ruleState.error;

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Parsing Error',
        description: error,
      });
    }
  }, [error]);

  const treeDataOriginal = makeTree(editables);

  const onCheck = (checkedKeys: any, info: any) => {
    console.log(treeDataOriginal);
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

  // const onSelect = (selectedKeys: any, info: any) => {
  //   dispatch(wordVariation(info.node.title));
  // };

  const clickedRuleIndex = useSelector(ruleSelector.clickedRuleIndex);

  return (
    <RuleSelectorDiv className="flex flex-col">
      {loadingRule && <OverlayLoading text="Apply Rules..." />}
      <Tree
        // checkable
        onCheck={onCheck}
        treeData={treeDataOriginal}
        defaultExpandAll={true}
        selectedKeys={[clickedRuleIndex]}
      />
    </RuleSelectorDiv>
  );
}

const RuleSelectorDiv = styled.div`
  .ant-tree {
    font-size: 16px;
    font-family: 'Courier';
  }
`;

export default RuleSelector;
