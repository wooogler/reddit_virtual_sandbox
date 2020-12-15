import React from 'react';
import styled from 'styled-components';
import { Rule, submitCode } from '../../modules/rule/slice';
import { Tree } from 'antd';
import { cloneDeep } from 'lodash';
import 'antd/dist/antd.css';
import { useDispatch } from 'react-redux';
import OverlayLoading from '../common/OverlayLoading';

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
  const dispatch = useDispatch();

  const treeDataOriginal: Tree = editables.map((rule, ruleIndex) => {
    return {
      title: `--- # Rule ${ruleIndex+1}`,
      key: `${ruleIndex}`,
      children: rule.lines.map((line, lineIndex) => {
        return {
          title: line.key,
          key: `${ruleIndex}-${lineIndex}`,
          children: line.words.map((word, wordIndex) => {
            return {
              title: word,
              key: `${ruleIndex}-${lineIndex}-${wordIndex}`,
            };
          }),
        };
      }),
    };
  });

  const keysToTree = (treeData: Tree, keys: string[]) => {
    treeData.forEach((tree1, tree1Index, treeObject) => {
      if (!keys.includes(tree1.key)) {
        treeObject.splice(tree1Index, 1);
      }
      tree1.children.forEach((tree2, tree2Index, tree1Object) => {
        if (!keys.includes(tree2.key)) {
          tree1Object.splice(tree2Index, 1);
        }
        tree2.children.forEach((tree3, tree3Index, tree2Object) => {
          if (!keys.includes(tree3.key)) {
            tree2Object.splice(tree3Index, 1);
          }
        });
      });
    });
    return treeData;
  };

  const treeToCode = (treeData: Tree) => {
    let code = '';
    treeData.forEach((tree1) => {
      code = code + `${tree1.title}\n`;
      tree1.children.forEach((tree2) => {
        code = code + `${tree2.title}: [`;
        tree2.children.forEach((tree3, index, arr) => {
          code = code + `"${tree3.title}"`;
          if (index !== arr.length - 1) {
            code = code + `, `;
          }
        });
        code = code + ']\n';
      });
    });
    return code;
  };

  const onCheck = (checkedKeys: any, info: any) => {
    const treeData = cloneDeep(treeDataOriginal);
    const code = treeToCode(
      keysToTree(treeData, [...checkedKeys, ...info.halfCheckedKeys]),
    );
    dispatch(submitCode(code));
  };

  return (
    <RuleSelectorDiv>
      {loadingRule && <OverlayLoading text='Apply Rules...' />}
      <Tree
        checkable
        onCheck={onCheck}
        treeData={treeDataOriginal}
        defaultExpandAll={true}
        selectable={false}
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
