import { IUser } from '@typings/db';
import { importSetting, Setting } from '@typings/types';
import request from '@utils/request';
import { AutoComplete, Button, Form, Modal, Progress, Select } from 'antd';
import React, { ReactElement, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { percentImport } from '@utils/util';
import { useFormik } from 'formik';
import { useStore } from '@utils/store';
import dayjs from 'dayjs';

const { Option } = Select;

interface Props {
  visible: boolean;
  postRefetch: () => void;
  onCancel: () => void;
}

function ImportModal({ visible, postRefetch, onCancel }: Props): ReactElement {
  const [importLoading, setImportLoading] = useState(false);
  const [completeSub, setCompleteSub] = useState(false);
  const [completeCom, setCompleteCom] = useState(false);
  const { after, changeAfter, changeRefetching } = useStore();

  const { data, refetch } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    return data;
  });
  const { data: modSubreddits } = useQuery('modSubreddits', async () => {
    const { data } = await request<string[]>({
      url: '/reddit/mod_subreddits/',
    });
    return data;
  });
  const { data: settingData, refetch: settingRefetch } = useQuery<Setting>(
    'setting',
    async () => {
      const { data } = await request<Setting>({
        url: '/stats/setting/',
      });
      return data;
    },
    {
      refetchInterval: importLoading ? 2000 : false,
    }
  );

  const formik = useFormik<importSetting>({
    initialValues: {
      subreddit: '',
      after: 'week',
      type: 'sub',
    },
    onSubmit: (values) => {
      setImportLoading(true);
      changeAfter(values.after);
      setCompleteSub(false);
      setCompleteCom(false);
      changeRefetching(true);
      if (values.type === 'all') {
        request({
          url: '/posts/',
          method: 'POST',
          data: {
            type: 'sub',
            subreddit: values.subreddit,
            after: values.after,
          },
        })
          .then((response) => {
            settingRefetch();
            setCompleteSub(true);
            request({
              url: '/posts/',
              method: 'POST',
              data: {
                type: 'com',
                subreddit: values.subreddit,
                after: values.after,
              },
            })
              .then((response) => {
                settingRefetch();
                setCompleteCom(true);
                setImportLoading(false);
                changeRefetching(false);
              })
              .catch((error) => {
                console.error(error);
                changeRefetching(false);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.log('hello');
        request({ url: '/posts/', method: 'POST', data: values })
          .then((response) => {
            setImportLoading(false);
            settingRefetch();
            if (values.type === 'sub') {
              setCompleteSub(true);
            } else {
              setCompleteCom(true);
            }
            changeRefetching(false);
          })
          .catch((error) => {
            console.error(error);
            changeRefetching(false);
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

  const nowDayStart = dayjs().startOf('day');

  return (
    <Modal
      title='Import Posts in Subreddit and Modlog'
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      footer={
        data && data.reddit_token === '' ? (
          <div className='flex mb-2' onClick={onClickRedditLogin}>
            <Button type='primary'>Reddit Login</Button>
          </div>
        ) : (
          <div className='flex flex-row'>
            <Button
              key='redditLogout'
              type='primary'
              danger
              onClick={onClickRedditLogout}
            >
              Reddit Logout
            </Button>
            <div className='ml-auto'>
              <Button
                type='primary'
                loading={importLoading}
                htmlType='submit'
                onClick={() => formik.handleSubmit()}
              >
                Import
              </Button>
            </div>
          </div>
        )
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
        <Form.Item label='Target Range' name='after' className='w-full'>
          <Select
            onChange={(value) => {
              formik.setFieldValue('after', value);
              changeAfter(value);
            }}
            defaultValue='week'
            value={after}
          >
            <Option value='3months'>last three months</Option>
            <Option value='month'>last month</Option>
            <Option value='2weeks'>last two weeks</Option>
            <Option value='week'>last week</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Post Type' name='type' className='w-full'>
          <Select
            onChange={(value) => formik.setFieldValue('type', value)}
            defaultValue='sub'
          >
            <Option value='sub'>Submission Only</Option>
            <Option value='com'>Comment Only</Option>
            <Option value='all'>All Posts</Option>
          </Select>
        </Form.Item>
        <div className='flex'>
          <div className='flex flex-col items-center'>
            <div className='text-lg'>Submissions</div>
            <Progress
              type='circle'
              percent={
                completeSub
                  ? 100
                  : percentImport(nowDayStart, after, settingData?.sub_recent)
              }
              format={(percent) => (
                <div>
                  <div>{percent}%</div>
                  <div className='text-sm'>( {settingData?.sub_count} )</div>
                </div>
              )}
            />
          </div>
          <div className='flex flex-col items-center ml-8'>
            <div className='text-lg'>Comments</div>
            <Progress
              type='circle'
              percent={
                completeCom
                  ? 100
                  : percentImport(nowDayStart, after, settingData?.com_recent)
              }
              format={(percent) => (
                <div>
                  <div>{percent}%</div>
                  <div className='text-sm'>( {settingData?.com_count} )</div>
                </div>
              )}
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default ImportModal;
