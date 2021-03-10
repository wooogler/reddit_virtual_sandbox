import React from 'react';
import { useSelector } from 'react-redux';
import RuleEditor from '../../components/rule/RuleEditor';
import RuleSelector from '../../components/rule/RuleSelector';
import WordFrequencyTable from '../../components/rule/WordFrequencyTable';
import WordVariationTable from '../../components/rule/WordVariationTable';
import { RootState } from '../../modules';
import { ruleSelector } from '../../modules/rule/slice';

function RuleEditorContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const fileIndex = ruleState.files.findIndex(
    (file) => file.tab === ruleState.selectedTab,
  );
  const loadingRule = useSelector(ruleSelector.loading);
  const tool = useSelector((state: RootState) => state.rule.tool);
  const wordFreqSim = useSelector(
    (state: RootState) => state.post.posts.wordVariation.word_freq_sim,
  );
  const wordFreq = useSelector(
    (state: RootState) => state.post.spams.wordFrequency.data,
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 mb-3">
        {ruleState.mode === 'edit' ? (
          <RuleEditor code={ruleState.files[fileIndex].code} />
        ) : (
          <RuleSelector
            editables={ruleState.editables}
            loadingRule={loadingRule}
          />
        )}
      </div>
      <div>
        {tool === 'sim' ? (
          <WordVariationTable wordVar={wordFreqSim} />
        ) : tool === 'freq' ? (
          <WordFrequencyTable wordFreq={wordFreq} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default RuleEditorContainer;
