import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';
import { useDispatch } from 'react-redux';
import { updateRuleValue } from '../../modules/rule/slice';

export interface RuleEditorProps {
  code: string,
}

function RuleEditor({code}: RuleEditorProps) {
  const dispatch = useDispatch();

  const handleChange = (input: string) => {
    dispatch(updateRuleValue(input))
  };
  
  return (
    <AceEditor
      mode="yaml"
      theme="github"
      onChange={handleChange}
      value={code}
      fontSize={14}
      width='100%'
      height='100%'
    />
  );
}

export default RuleEditor;
