import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';

export interface RuleEditorProps {}

function RuleEditor({}: RuleEditorProps) {
  const [code, setCode] = useState('');
  const handleChange = (value: string) => {
    setCode(value);
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
