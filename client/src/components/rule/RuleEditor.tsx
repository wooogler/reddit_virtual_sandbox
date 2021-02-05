import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useDispatch, useSelector } from 'react-redux';
import { updateFileCode } from '../../modules/rule/slice';
import { Alert } from 'antd';
import { RootState } from '../../modules';

export interface RuleEditorProps {
  code: string;
}

function RuleEditor({ code }: RuleEditorProps) {
  const dispatch = useDispatch();
  const parseError = useSelector((state: RootState) => state.rule.parseError);

  const handleChange = (input: string) => {
    dispatch(updateFileCode(input));
  };

  return (
    <>
      <AceEditor
        mode="yaml"
        theme="tomorrow"
        onChange={handleChange}
        value={code}
        width="100%"
        height="100%"
        setOptions={{
          showGutter: true,
          fontFamily: 'Courier',
          fontSize: '18px',
        }}
        placeholder={
          "---\ntitle: ['hi', 'hello']\nbody (includes): ['have']\n---"
        }
      />
      {parseError &&
        parseError.map((errors, ruleIndex) => {
          return errors.map((error, errorIndex) => (
            <Alert
              key={`${ruleIndex}-${errorIndex}`}
              type="error"
              message={`Rule ${ruleIndex+1} : ${error.name}`}
              description={error.message}
            />
          ));
        })}
    </>
  );
}

export default RuleEditor;
