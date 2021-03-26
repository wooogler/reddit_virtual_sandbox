import { Tabs, Tooltip } from 'antd';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import { ruleSelector } from '../../modules/rule/slice';
import FindFPFN from './FindFPFN';
import WordFrequencyTable from './WordFrequencyTable';
import WordVariationTable from './WordVariationTable';

interface Props {}

const { TabPane } = Tabs;

function AnalysisTools({}: Props): ReactElement {
  const wordFreqSim = useSelector(
    (state: RootState) => state.stat.wordVariation.data,
  );
  const wordFreq = useSelector(
    (state: RootState) => state.stat.wordFrequency.data,
  );
  const mode = useSelector((state: RootState) => state.rule.mode);
  return (
    <div className="flex flex-col p-2">
      <div className="text-xl mx-2 font-display">Analysis Tools</div>
      <Tabs defaultActiveKey="wf" centered size="small">
        <TabPane tab="Word Frequency" key="wf">
          <WordFrequencyTable wordFreq={wordFreq} />
        </TabPane>
        <TabPane tab="Similar Words" key="wv">
          <WordVariationTable wordVar={wordFreqSim} />
        </TabPane>
        <TabPane
          tab={
            mode==='edit'?
            (<Tooltip title="Please apply your configuration first">
              Find FP & FN
            </Tooltip>) :
            'Find FP & FN'
          }
          key="fpfn"
          disabled={mode === 'edit'}
        >
          <FindFPFN />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default AnalysisTools;
