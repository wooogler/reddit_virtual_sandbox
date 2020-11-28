import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useDispatch } from 'react-redux';
import { updateFileCode } from '../../modules/rule/slice';

export interface RuleEditorProps {
  code: string,
}

function RuleEditor({code}: RuleEditorProps) {
  const dispatch = useDispatch();

  const handleChange = (input: string) => {
    dispatch(updateFileCode(input))
  };
  
  return (
    <AceEditor
      mode="yaml"
      theme="tomorrow"
      onChange={handleChange}
      value={code}
      width='100%'
      height='100%'
      setOptions={{
        showGutter: false,
        fontFamily: 'Courier',
        fontSize: '16px'
      }}
    />
  );
}

export default RuleEditor;
