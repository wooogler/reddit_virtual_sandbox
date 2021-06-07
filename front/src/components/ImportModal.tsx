import { IUser } from '@typings/db';
import { ImportSetting, Setting } from '@typings/types';
import request from '@utils/request';
import { AutoComplete, Button, Form, Modal, Select } from 'antd';
import React, { ReactElement, useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useFormik } from 'formik';
import { useStore } from '@utils/store';
import ImportProgress from './ImportProgress';
import { CheckCircleTwoTone } from '@ant-design/icons';

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

  const { after, imported, changeAfter, changeRefetching, changeImported } =
    useStore();

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
    if (type === 'submissions') {
      if (where === 'live') {
        setCompleteLiveSub(value);
      } else if (where === 'spam') {
        setCompleteSpamSub(value);
      }
    } else if (type === 'comments') {
      if (where === 'live') {
        setCompleteLiveCom(value);
      } else if (where === 'spam') {
        setCompleteSpamCom(value);
      }
    }
  };

  const importPostsMutation = useMutation(importPosts, {
    onMutate: ({ type, where }) => {
      setComplete(false, { type, where });
      changeRefetching(true);
    },
    onSuccess: (_, { type, where }) => {
      setComplete(true, { type, where });
      changeRefetching(false);
      queryClient.invalidateQueries('filtered');
      queryClient.invalidateQueries('not filtered');
      queryClient.invalidateQueries('stats/filtered');
      queryClient.invalidateQueries('stats/not_filtered');
      queryClient.invalidateQueries('setting');
      changeImported(true);
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
      after: 'week',
      type: 'submissions',
      where: 'live',
    },
    onSubmit: async (values) => {
      const { subreddit, after, type, where } = values;
      changeAfter(values.after);
      if (type !== 'comments' && where !== 'spam') {
        await importPostsMutation.mutateAsync({
          subreddit,
          after,
          type: 'submissions',
          where: 'live',
        });
      }
      if (type !== 'submissions' && where !== 'spam') {
        await importPostsMutation.mutateAsync({
          subreddit,
          after,
          type: 'comments',
          where: 'live',
        });
      }
      if (type !== 'comments' && where !== 'live') {
        importPostsMutation.mutateAsync({
          subreddit,
          after,
          type: 'submissions',
          where: 'spam',
        });
      }
      if (type !== 'submissions' && where !== 'live') {
        console.log(type, where);
        await importPostsMutation.mutateAsync({
          subreddit,
          after,
          type: 'comments',
          where: 'spam',
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
                <Button
                  type='primary'
                  loading={importPostsMutation.isLoading}
                  htmlType='submit'
                  onClick={() => formik.handleSubmit()}
                >
                  Import
                </Button>
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
          initialValue='submissions'
        >
          <Select onChange={(value) => formik.setFieldValue('type', value)}>
            <Option value='submissions'>Submission Only</Option>
            <Option value='comments'>Comment Only</Option>
            <Option value='all'>All Posts</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Import From'
          name='where'
          className='w-full'
          initialValue='live'
        >
          <Select onChange={(value) => formik.setFieldValue('where', value)}>
            <Option value='live'>Current Subreddit</Option>
            <Option
              value='spam'
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
          {formik.values.where !== 'spam' && (
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
          {formik.values.where !== 'live' && (
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
              {imported && (
                <div className='flex items-center mt-2 text-lg'>
                  <CheckCircleTwoTone twoToneColor='#52c41a' />
                  <div className='ml-2'>It's Done, please close.</div>
                </div>
              )}
            </>
          )}
        </div>
      </Form>
    </Modal>
  );
}

export default ImportModal;
