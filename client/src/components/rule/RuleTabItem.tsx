import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { changeFile, closeFile, ruleSelector, updateFilename } from '../../modules/rule/slice';

export interface RuleTabItemProps {
  active: boolean;
  tab: number;
  title: string;
}

function RuleTabItem({ active = false, tab, title }: RuleTabItemProps) {
  const dispatch = useDispatch();
  const numberOfTabs = useSelector(ruleSelector.numberOfTabs)
  const [isEditable, setIsEditable] = useState(false);
  const [filename, setFilename] = useState(title);
  const handleClose = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(changeFile(0));
    dispatch(closeFile(tab));
  };
  const handleClickTab = () => {
    dispatch(changeFile(tab));
  };
  const handleRename = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    setIsEditable(true);
  };

  return (
    <TabBlock active={active} onClick={handleClickTab}>
      {isEditable ? (
        <input
          className="filename"
          value={filename}
          onChange={(e) => {
            setFilename(e.target.value);
          }}
          onKeyPress={(e) => {
            if(e.key === 'Enter') {
              dispatch(updateFilename(filename));
              setIsEditable(false);
            }
          }}
        />
      ) : (
        title
      )}
      {active && !isEditable && (
        <>
          <RenameButton onClick={handleRename}>
            <EditOutlined />
          </RenameButton>
          {numberOfTabs !==1 &&
            <CloseButton onClick={handleClose}>
              <CloseOutlined />
            </CloseButton>
          }
        </>
      )}
    </TabBlock>
  );
}

const TabBlock = styled.button<{ active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  font-family: monospace;
  font-size: 1rem;
  height: 3rem;
  padding: 0 1rem;
  background: ${(props) => (props.active ? 'white' : palette.gray[1])};
  .filename {
    width: 9rem
  }
`;

const CloseButton = styled.span`
  margin-left: 1rem;
  display: flex;
  cursor: pointer;
`;
const RenameButton = styled.span`
  margin-left: 1rem;
  display: flex;
  cursor: pointer;
`;

export default RuleTabItem;
