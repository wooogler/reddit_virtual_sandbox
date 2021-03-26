import { Alert, Button, Select } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FindFPFN from '../../components/rule/FindFPFN';
import RuleEditor from '../../components/rule/RuleEditor';
import RuleSelector from '../../components/rule/RuleSelector';
import WordFrequencyTable from '../../components/rule/WordFrequencyTable';
import WordVariationTable from '../../components/rule/WordVariationTable';
import { RootState } from '../../modules';
import { ruleSelector } from '../../modules/rule/slice';
import { changeExperiment } from '../../modules/user/slice';
import RuleActionsContainer from './RuleActionsContainer';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import RuleActions from '../../components/rule/RuleActions';
import { InfoCircleOutlined } from '@ant-design/icons';
import DraggableModal from '../../components/common/DraggableModalOld';
import styled from 'styled-components';
import ConfigurationGuide from '../../components/rule/ConfigurationGuide';

function RuleEditorContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  // const fileIndex = ruleState.files.findIndex(
  //   (file) => file.tab === ruleState.selectedTab,
  // );
  const loadingRule = useSelector(ruleSelector.loading);
  // const dispatch = useDispatch();

  const [code, setCode] = useState('');
  const parseError = useSelector((state: RootState) => state.rule.parseError);

  const { Option } = Select;

  const [isOpenGuide, setIsOpenGuide] = useState(false);

  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex items-center">
        <div className="text-xl mx-2 font-display my-1">
          Keyword Filter Configuration
        </div>
        <Button
          size="small"
          className="ml-auto"
          icon={<InfoCircleOutlined />}
          onClick={() => {
            setIsOpenGuide(true);
          }}
        >
          Configuration Guide
        </Button>
        <DraggableModal
          visible={isOpenGuide}
          title="Configuration Guide"
          setVisible={setIsOpenGuide}
        >
          <ConfigurationGuide />
        </DraggableModal>
        {/* <Select
          size="small"
          defaultValue="modsandbox"
          onChange={(value) => dispatch(changeExperiment(value))}
          className="w-40 ml-auto mr-2"
        >
          <Option value="baseline">baseline</Option>
          <Option value="sandbox">sandbox</Option>
          <Option value="modsandbox">ModSandbox</Option>
        </Select> */}
      </div>
      <div className="flex-1">
        {ruleState.mode === 'edit' ? (
          <>
            <AceEditor
              mode="yaml"
              theme="tomorrow"
              onChange={(code) => setCode(code)}
              value={code}
              width="100%"
              height="100%"
              setOptions={{
                showGutter: true,
                fontFamily: 'Courier',
                fontSize: '18px',
              }}
              placeholder={
                // "---\ntitle: ['hi', 'hello']\nbody (includes): ['have']\n---"
                "body: [ 'keyword 1' , 'keyword 2' ]"
              }
            />
            {parseError &&
              parseError.map((errors, ruleIndex) => {
                return errors.map((error, errorIndex) => (
                  <Alert
                    key={`${ruleIndex}-${errorIndex}`}
                    type="error"
                    message={`Rule ${ruleIndex + 1} : ${error.name}`}
                    description={error.message}
                  />
                ));
              })}
          </>
        ) : (
          <RuleSelector
            editables={ruleState.editables}
            loadingRule={loadingRule}
          />
        )}
      </div>
      <div className="flex bg-gray-200">
        <RuleActions mode={ruleState.mode} code={code} title="code.yml" />
      </div>
    </div>
  );
}


export default RuleEditorContainer;
