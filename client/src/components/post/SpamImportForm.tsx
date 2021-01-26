import { Button, Select } from 'antd';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useGetApi, useGetApiWithParam } from '../../lib/hooks';
import { postActions } from '../../modules/post/slice';
import { userSelector } from '../../modules/user/slice';

interface SpamImportFormProps {
  onClickClose: () => void;
}

function SpamImportForm({ onClickClose }: SpamImportFormProps) {
  const dispatch = useDispatch();
  const token = useSelector(userSelector.token);

  const { Option } = Select;

  const [modSubreddits, errorSub, loadingSub] = useGetApi<string[]>(
    token,
    '/mod_subreddits/',
  );

  const formik = useFormik({
    initialValues: {
      subreddit: '',
      mod_type: '',
      removal_reason: 'all',
      community_rule: 'all',
      moderator_name: 'all',
      reported_by: 'all',
    },
    onSubmit: (values) => {
      dispatch(
        postActions.importSpamPosts({
          subreddit_name: values.subreddit,
          mod_type: values.mod_type,
          removal_reason: values.removal_reason,
          community_rule: values.community_rule,
          moderator_name: values.moderator_name,
          reported_by: values.reported_by,
        }),
      );
      onClickClose();
    },
  });

  const [removalReasons, errorReasons, loadingReasons] = useGetApiWithParam<
    string[]
  >(token, '/removal_reasons/', formik.values.subreddit);

  const [rules, errorRules, loadingRules] = useGetApiWithParam<string[]>(
    token,
    '/community_rules',
    formik.values.subreddit,
  );

  const [mods, errorMods, loadingMods] = useGetApiWithParam<string[]>(
    token,
    '/get_moderators/',
    formik.values.subreddit,
  );

  return (
    <SpamImportFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Import Seeds</div>
      <label>Target mod subreddit</label>
      <Select
        size="large"
        onChange={(value) => {
          formik.setFieldValue('subreddit', value);
        }}
        disabled={!!errorSub}
        loading={loadingSub}
      >
        {modSubreddits &&
          modSubreddits.map((sub) => (
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
      {formik.values.mod_type === 'spam' && (
        <>
          <label>Target Removal Reason</label>
          <Select
            size="large"
            onChange={(value) => {
              formik.setFieldValue('removal_reason', value);
            }}
            defaultValue="all"
            disabled={!!errorReasons}
            loading={loadingReasons}
          >
            <Option value="all">All</Option>
            {removalReasons &&
              removalReasons.map((reason) => (
                <Option value={reason} key={reason}>
                  {reason}
                </Option>
              ))}
          </Select>
          <label>Banned by</label>
          <Select
            size="large"
            onChange={(value) => {
              formik.setFieldValue('moderator_name', value);
            }}
            disabled={!!errorMods}
            loading={loadingMods}
            defaultValue="all"
          >
            <Option value="all">All Moderators</Option>
            {mods &&
              mods.map((reason) => (
                <Option value={reason} key={reason}>
                  {reason}
                </Option>
              ))}
          </Select>
        </>
      )}
      {formik.values.mod_type === 'reports' && (
        <>
          <label>Reports by</label>
          <Select
            size="large"
            onChange={(value) => {
              formik.setFieldValue('reported_by', value);
            }}
            disabled={!!errorRules}
            loading={loadingRules}
            defaultValue="all"
          >
            <Option value="all">Moderators and Users</Option>
            <Option value="mod">Moderators</Option>
            <Option value="user">Users</Option>
          </Select>
          {formik.values.reported_by === 'mod' ? (
            <>
              <label>Moderator who reported</label>
              <Select
                size="large"
                onChange={(value) => {
                  formik.setFieldValue('moderator_name', value);
                }}
                disabled={!!errorMods}
                loading={loadingMods}
                defaultValue="all"
              >
                <Option value="all">All Moderators</Option>
                {mods &&
                  mods.map((reason) => (
                    <Option value={reason} key={reason}>
                      {reason}
                    </Option>
                  ))}
              </Select>
            </>
          ) : (
            formik.values.reported_by === 'user' && (
              <>
                <label>Target Community Rules</label>
                <Select
                  size="large"
                  onChange={(value) => {
                    formik.setFieldValue('community_rule', value);
                  }}
                  disabled={!!errorRules}
                  loading={loadingRules}
                  defaultValue="all"
                >
                  <Option value="all">All</Option>
                  {rules &&
                    rules.map((rule) => (
                      <Option value={rule} key={rule}>
                        {rule}
                      </Option>
                    ))}
                </Select>
              </>
            )
          )}
        </>
      )}

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
