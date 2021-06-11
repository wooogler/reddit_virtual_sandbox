import { IUser } from '@typings/db';
import { ImportSetting, Setting } from '@typings/types';
import request from '@utils/request';
import { AutoComplete, Button, Form, Modal, Select } from 'antd';
import React, { ReactElement, useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useFormik } from 'formik';
import { useStore } from '@utils/store';
import ImportProgress from './ImportProgress';
import { CheckCircleTwoTone, SyncOutlined } from '@ant-design/icons';
import axios, { Canceler } from 'axios';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
}

function ImportModal({ visible, onCancel }: Props): ReactElement {
  const [completeLiveSub, setCompleteLiveSub] = useState(false);
  const [completeLiveCom, setCompleteLiveCom] = useState(false);
  const [completeSpamSub, setCompleteSpamSub] = useState(false);
  const [completeSpamCom, setCompleteSpamCom] = useState(false);

  const queryClient = useQueryClient();

  const {
    after,
    imported,
    post_type,
    source,
    changeAfter,
    changeRefetching,
    changeImported,
    changeSource,
    changePostType,
  } = useStore();

  const { data: userData, refetch } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    return data;
  });
  const { data: modSubreddits } = useQuery(
    'modSubreddits',
    async () => {
      const { data } = await request<string[]>({
        url: '/reddit/mod_subreddits/',
      });
      return data;
    },
    {
      enabled: userData && userData.reddit_token !== '',
    }
  );

  const CancelToken = axios.CancelToken;

  let cancelImport: Canceler;
  const importPosts = ({ type, where, subreddit, after }: ImportSetting) =>
    request({
      url: '/posts/',
      method: 'POST',
      data: {
        type,
        subreddit,
        after,
        where,
      },
      cancelToken: new CancelToken(function executor(c) {
        cancelImport = c;
      }),
    });
  const setAllComplete = (value: boolean) => {
    setCompleteSpamCom(value);
    setCompleteSpamSub(value);
    setCompleteLiveSub(value);
    setCompleteLiveCom(value);
  };

  const setComplete = (
    value: boolean,
    { type, where }: Pick<ImportSetting, 'type' | 'where'>
  ) => {
    if (type === 'Submission') {
      if (where === 'Subreddit') {
        setCompleteLiveSub(value);
      } else if (where === 'Spam') {
        setCompleteSpamSub(value);
      }
    } else if (type === 'Comment') {
      if (where === 'Subreddit') {
        setCompleteLiveCom(value);
      } else if (where === 'Spam') {
        setCompleteSpamCom(value);
      }
    }
  };

  const importPostsMutation = useMutation(importPosts, {
    onMutate: ({ type, where }) => {
      setComplete(false, { type, where });
      changeRefetching(true);
      changeImported(false);
    },
    onSuccess: (_, { type, where }) => {
      setComplete(true, { type, where });
      changeRefetching(false);
      changeImported(true);
      queryClient.invalidateQueries('filtered');
      queryClient.invalidateQueries('not filtered');
      queryClient.invalidateQueries('stats/filtered');
      queryClient.invalidateQueries('stats/not_filtered');
      queryClient.invalidateQueries('setting');
    },
  });

  const { data: settingData } = useQuery<Setting>(
    'setting',
    async () => {
      const { data } = await request<Setting>({
        url: '/stats/setting/',
      });
      return data;
    },
    {
      refetchInterval: importPostsMutation.isLoading ? 2000 : false,
    }
  );

  const formik = useFormik<ImportSetting>({
    initialValues: {
      subreddit: '',
      after: after,
      type: post_type,
      where: source,
    },
    onSubmit: async (values) => {
      const { subreddit, after, type, where } = values;
      changeAfter(values.after);
      if (type !== 'Comment' && where !== 'Spam') {
        await importPostsMutation.mutateAsync({
          subreddit,
          after,
          type: 'Submission',
          where: 'Subreddit',
        });
      }
      if (type !== 'Submission' && where !== 'Spam') {
        await importPostsMutation.mutateAsync({
          subreddit,
          after,
          type: 'Comment',
          where: 'Subreddit',
        });
      }
      if (type !== 'Comment' && where !== 'Subreddit') {
        importPostsMutation.mutateAsync({
          subreddit,
          after,
          type: 'Submission',
          where: 'Spam',
        });
      }
      if (type !== 'Submission' && where !== 'Subreddit') {
        console.log(type, where);
        await importPostsMutation.mutateAsync({
          subreddit,
          after,
          type: 'Comment',
          where: 'Spam',
        });
      }
    },
  });

  const onClickRedditLogin = useCallback(() => {
    request<string>({
      url: '/reddit/login/',
    })
      .then((response) => {
        console.log('reddit login success');
        window.location.href = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onClickRedditLogout = useCallback(() => {
    request<string>({
      url: '/reddit/logout/',
    })
      .then((response) => {
        console.log('reddit logout success');
        refetch();
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refetch]);

  const onCancelImport = () => {
    cancelImport();
  };

  return (
    <Modal
      title='Import Posts in Subreddit and Modlog'
      visible={visible}
      onCancel={() => {
        onCancel();
        setAllComplete(false);
      }}
      maskClosable={false}
      centered
      destroyOnClose
      footer={
        <div className='flex flex-row'>
          {userData && userData.reddit_token === '' ? (
            <div className='flex mb-2' onClick={onClickRedditLogin}>
              <Button type='primary'>Reddit Login</Button>
            </div>
          ) : (
            <Button
              key='redditLogout'
              type='primary'
              danger
              onClick={onClickRedditLogout}
            >
              Reddit Logout
            </Button>
          )}
          {!imported && (
            <div className='ml-auto'>
              {!imported && (
                <>
                  {/* <Button onClick={onCancelImport}>Cancel</Button> */}
                  <Button
                    type='primary'
                    loading={importPostsMutation.isLoading}
                    htmlType='submit'
                    onClick={() => formik.handleSubmit()}
                  >
                    Import
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      }
    >
      <Form className='flex flex-col items-center w-full'>
        <Form.Item label='Target Subreddit' name='subreddit' className='w-full'>
          <AutoComplete
            value={formik.values.subreddit}
            onChange={(value) => formik.setFieldValue('subreddit', value)}
            options={
              modSubreddits && modSubreddits.map((sub) => ({ value: sub }))
            }
          />
        </Form.Item>
        <Form.Item
          label='Target Range'
          name='after'
          className='w-full'
          initialValue={after}
        >
          <Select
            onChange={(value) => {
              formik.setFieldValue('after', value);
              changeAfter(value);
            }}
            value={after}
          >
            <Option value='3months'>last three months</Option>
            <Option value='month'>last month</Option>
            <Option value='2weeks'>last two weeks</Option>
            <Option value='week'>last week</Option>
            <Option value='3days'>last three days</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Post Type'
          name='type'
          className='w-full'
          initialValue={post_type}
        >
          <Select
            onChange={(value) => {
              formik.setFieldValue('type', value);
              changePostType(value);
            }}
            value={post_type}
          >
            <Option value='Submission'>Submission Only</Option>
            <Option value='Comment'>Comment Only</Option>
            <Option value='all'>All Posts</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Import From'
          name='where'
          className='w-full'
          initialValue={source}
        >
          <Select
            onChange={(value) => {
              formik.setFieldValue('where', value);
              changeSource(value);
            }}
            value={source}
          >
            <Option value='Subreddit'>Current Subreddit</Option>
            <Option
              value='Spam'
              disabled={userData && userData.reddit_token === ''}
            >
              Spam/Reports in Mod Tools
            </Option>
            <Option
              value='all'
              disabled={userData && userData.reddit_token === ''}
            >
              Subreddit & Spam/Reports
            </Option>
          </Select>
        </Form.Item>
        <div className='flex flex-col items-center'>
          {formik.values.where !== 'Spam' && (
            <>
              <div className='text-lg mt-2'>Current Subreddit</div>
              <div className='flex'>
                <div className='flex flex-col items-center'>
                  <div className='text-sm'>Submissions</div>
                  <ImportProgress
                    recent={settingData?.live_sub_recent}
                    count={settingData?.live_sub_count}
                    complete={completeLiveSub}
                  />
                </div>
                <div className='flex flex-col items-center ml-8'>
                  <div className='text-sm'>Comments</div>
                  <ImportProgress
                    recent={settingData?.live_com_recent}
                    count={settingData?.live_com_count}
                    complete={completeLiveCom}
                  />
                </div>
              </div>
            </>
          )}
          {formik.values.where !== 'Subreddit' && (
            <>
              <div className='text-lg mt-2'>Spam/Reports in Mod Tools</div>
              <div className='flex'>
                <div className='flex flex-col items-center'>
                  <div className='text-sm'>Submissions</div>
                  <ImportProgress
                    recent={settingData?.spam_sub_recent}
                    count={settingData?.spam_sub_count}
                    complete={completeSpamSub}
                  />
                </div>
                <div className='flex flex-col items-center ml-8'>
                  <div className='text-sm'>Comments</div>
                  <ImportProgress
                    recent={settingData?.spam_com_recent}
                    count={settingData?.spam_com_count}
                    complete={completeSpamCom}
                  />
                </div>
              </div>
            </>
          )}

          <div className='flex items-center mt-2 text-lg'>
            {imported ? (
              <>
                <CheckCircleTwoTone twoToneColor='#52c41a' />
                <div className='ml-2'>It's Done, please close the window.</div>
              </>
            ) : (
              importPostsMutation.isLoading && (
                <>
                  <SyncOutlined spin style={{ color: '#1790FF' }} />
                  <div className='ml-2'>Importing the posts, please wait.</div>
                </>
              )
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default ImportModal;
