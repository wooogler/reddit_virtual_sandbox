import { Button, Select } from 'antd';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useModSubApi } from '../../lib/hooks';
import { postActions, postSelector } from '../../modules/post/slice';
import { userSelector } from '../../modules/user/slice';

interface SpamImportFormProps {
  onClickClose: () => void;
}

function SpamImportForm({ onClickClose }: SpamImportFormProps) {
  const dispatch = useDispatch();
  const token = useSelector(userSelector.token);
  const loadingDelete = useSelector(postSelector.loadingSpamDelete);
  const handleDeleteAll = () => {
    dispatch(postActions.deleteAllSpams())
  }
  
  const { Option } = Select;

  const [modSubreddits, error, loading] = useModSubApi(token);

  const formik = useFormik({
    initialValues: {
      subreddit: '',
      mod_type: 'spam'
    },
    onSubmit: (values) => {
      dispatch(
        postActions.importSpamPosts({
          subreddit_name: values.subreddit,
          mod_type: values.mod_type,
        })
      )
      onClickClose();
    },
  });

  return (
    <SpamImportFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Import Seeds</div>
      <label>Target mod subreddit</label>
      <Select
        size="large"
        onChange={(value) => {
          formik.setFieldValue('subreddit', value);
        }}
        disabled={!!error}
        loading={loading}
      >
        {modSubreddits.map((sub) => (
          <Option value={sub} key={sub}>
            {sub}
          </Option>
        ))}
      </Select>
      <label>Target queues</label>
      <Select
        size="large"
        onChange={(value) => {
          formik.setFieldValue('mod_type', value);
        }}
      >
        <Option value="modqueue">Mod queue</Option>
        <Option value="reports">Reports</Option>
        <Option value="spam">Spam</Option>
      </Select>
      <label>Delete All Seed Posts</label>
      <Button danger loading={loadingDelete} onClick={handleDeleteAll}>
        Delete all posts
      </Button>
      <div className="buttons">
        <Button onClick={onClickClose}>Close</Button>
        <Button type="primary" htmlType="submit">
          Import
        </Button>
      </div>
    </SpamImportFormDiv>
  );
}

const SpamImportFormDiv = styled.form`
  display: flex;
  flex-direction: column;
  margin: 20px;
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  label {
    margin-left: 0.2rem;
    margin-top: 1rem;
    margin-bottom: 0.2rem;
    font-size: 1rem;
  }
  .buttons {
    display: flex;
    margin-left: auto;
    margin-top: 1rem;
    button {
      margin-left: 1rem;
    }
  }
`;

export default SpamImportForm;
