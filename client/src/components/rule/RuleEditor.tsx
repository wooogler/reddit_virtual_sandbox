import { Alert, Button, Popconfirm, Select } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FindFPFN from './FindFPFN';
import RuleSelector from './RuleSelector';
import WordFrequencyTable from './WordFrequencyTable';
import WordVariationTable from './WordVariationTable';
import { RootState } from '../../modules';
import { ruleSelector } from '../../modules/rule/slice';
import { changeExperiment, logout } from '../../modules/user/slice';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import RuleActions from './RuleActions';
import { InfoCircleOutlined } from '@ant-design/icons';
import DraggableModal from '../common/DraggableModalOld';
import AntDraggableModal from '../common/DraggableModal';
import styled from 'styled-components';
import ConfigurationGuide from './ConfigurationGuide';
import Goal from './Goal';

function RuleEditor() {
  const ruleState = useSelector((state: RootState) => state.rule);
  // const fileIndex = ruleState.files.findIndex(
  //   (file) => file.tab === ruleState.selectedTab,
  // );
  const loadingRule = useSelector(ruleSelector.loading);
  const dispatch = useDispatch();

  const [code, setCode] = useState('');
  const [isOpenGoal, setIsOpenGoal] = useState(false);
  const parseError = useSelector((state: RootState) => state.rule.parseError);

  const { Option } = Select;

  const [isOpenGuide, setIsOpenGuide] = useState(false);

  const handleClickLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(logout(token));
      localStorage.removeItem('token');
    }
  };
  const handleClickGoal = () => {
    setIsOpenGoal(true);
  };

  return (
    <div className="flex flex-col h-full" data-tour="step-rule">
      <div className="flex flex-col">
        <div className="bg-gray-200 p-2 flex">
          <Button
            size="small"
            onClick={handleClickGoal}
            icon={<InfoCircleOutlined />}
            className="ml-3"
            type="primary"
          >
            Task Goal
          </Button>
          <AntDraggableModal
            visible={isOpenGoal}
            setVisible={setIsOpenGoal}
            title="Configuration Goal"
          >
            <Goal />
          </AntDraggableModal>
          <Select
            size="small"
            defaultValue="modsandbox"
            onChange={(value) => dispatch(changeExperiment(value))}
            className="w-40 ml-2"
          >
            <Option value="baseline">baseline</Option>
            <Option value="sandbox">sandbox</Option>
            <Option value="modsandbox">ModSandbox</Option>
          </Select>
          <Popconfirm
            placement="bottom"
            title="Are you sure? Time is left."
            onConfirm={handleClickLogout}
            className="ml-auto"
          >
            <Button danger type="primary" className="mr-2" size="small">
              End Experiment
            </Button>
          </Popconfirm>
        </div>
        <div className="flex items-center">
          <div className="text-xl mx-2 font-display my-1">
            Keyword Filter Configuration
          </div>
          <Button
            size="small"
            className="ml-auto mr-1"
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
        </div>
      </div>
      <div className="flex-1" data-tour="step-editor">
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

export default RuleEditor;
