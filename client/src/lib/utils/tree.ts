import { Rule } from '../../modules/rule/slice';

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

export const makeTree = (editables: Rule[]): Tree => {
  return editables.map((rule, ruleIndex) => {
    return {
      title: `--- # Rule ${ruleIndex + 1}`,
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
};

export type KeyMap = { original: string; changed: string };


export const keysToTree = (treeData: Tree, keys: string[]) => {

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

//선택하는 부분에서 key가 틀어지는 것을 막기 위해 원래 위치를 저장하는 함수
export const treeToKeyMaps = (treeData: Tree) => {
  let keyMaps: KeyMap[] = [];
  treeData.forEach((tree1, tree1Index) => {
    keyMaps.push({original: tree1.key, changed: `${tree1Index}`})
    tree1.children.forEach((tree2, tree2Index) => {
      keyMaps.push({original: tree2.key, changed: `${tree1Index}-${tree2Index}`})
      tree2.children.forEach((tree3, tree3Index) => {
        keyMaps.push({original: tree3.key, changed: `${tree1Index}-${tree2Index}-${tree3Index}`})
      })
    })
  });
  return keyMaps;
}

export const treeToCode = (treeData: Tree) => {
  let code = '';
  treeData.forEach((tree1) => {
    code = code + `${tree1.title}\n`;
    tree1.children.forEach((tree2) => {
      code = code + `${tree2.title}: [`;
      tree2.children.forEach((tree3, index, arr) => {
        code = code + `'${tree3.title}'`;
        if (index !== arr.length - 1) {
          code = code + `, `;
        }
      });
      code = code + ']\n';
    });
  });
  return code;
};
