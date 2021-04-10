import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Tabs, Tooltip } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import Tour, { ReactourStep } from 'reactour';
import { RootState } from '../../modules';
import { ruleSelector } from '../../modules/rule/slice';
import FindFPFN from './FindFPFN';
import WordFrequencyTable from './WordFrequencyTable';
import WordVariationTable from './WordVariationTable';

interface Props {}

const { TabPane } = Tabs;

const steps: ReactourStep[] = [
  {
    selector: '.ant-tabs-nav-list',
    content: 'You can see the manually moderated posts here',
  },
];

function AnalysisTools({}: Props): ReactElement {
  const wordFreqSim = useSelector(
    (state: RootState) => state.stat.wordVariation.data,
  );
  const wordFreq = useSelector(
    (state: RootState) => state.stat.wordFrequency.data,
  );
  const [isOpenFeature, setIsOpenFeature] = useState(false);
  const mode = useSelector((state: RootState) => state.rule.mode);

  const handleClickFeature = () => {
    setIsOpenFeature(true);
  };
  return (
    <>
      <div className="flex flex-col pt-2">
        <div className="flex">
          <div className="text-xl mx-2 font-display">Analysis Tools</div>
          <Button
            size="small"
            className="ml-auto mr-1"
            icon={<InfoCircleOutlined />}
            onClick={handleClickFeature}
          >
            Features Guide
          </Button>
        </div>
        <Tabs defaultActiveKey="wf" centered size="small">
          <TabPane tab="Word Frequency" key="wf" data-tour="step-tabs">
            <WordFrequencyTable wordFreq={wordFreq} />
          </TabPane>
          <TabPane tab="Similar Words" key="wv">
            <WordVariationTable wordVar={wordFreqSim} />
          </TabPane>
          <TabPane
            tab={
              mode === 'edit' ? (
                <Tooltip title="Please apply your configuration first">
                  Find FP & FN
                </Tooltip>
              ) : (
                'Find FP & FN'
              )
            }
            key="fpfn"
            disabled={mode === 'edit'}
          >
            <FindFPFN />
          </TabPane>
        </Tabs>
      </div>
      <Tour
        steps={steps}
        isOpen={isOpenFeature}
        onRequestClose={() => setIsOpenFeature(false)}
        disableFocusLock={true}
      />
    </>
  );
}

export default AnalysisTools;
