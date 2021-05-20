import PageLayout from '@layouts/PageLayout';
import { IUser, PaginatedPosts } from '@typings/db';
import request from '@utils/request';
import { AutoComplete, Button, Form, Select } from 'antd';
import React, { ReactElement, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const { Option } = Select;

function SettingsPage(): ReactElement {
  const [importLoading, setImportLoading] = useState(false);

  const { data, refetch } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    console.log(data);
    return data;
  });
  const { data: modSubreddits } = useQuery('modSubreddits', async () => {
    const { data } = await request<string[]>({
      url: '/reddit/mod_subreddits/',
    });
    console.log(data);
    return data;
  });
  const { data: postData, refetch: postRefetch } = useQuery(
    'posts',
    async () => {
      const { data } = await request<PaginatedPosts>({ url: '/posts/' });
      return data;
    }
  );

  const onFinish = useCallback(
    (values: any) => {
      setImportLoading(true);
      request({ url: '/posts/', method: 'POST', data: values })
        .then((response) => {
          console.log(response);
          setImportLoading(false);
          postRefetch();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [postRefetch]
  );

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

  const onClickDeleteAll = useCallback(() => {
    request<string>({
      url: '/posts/all/',
      method: 'DELETE',
    })
      .then((response) => {
        console.log('delete all');
        postRefetch();
      })
      .catch((error) => {
        console.error(error);
      });
  }, [postRefetch]);

  return (
    <PageLayout title='Settings'>
      <Form className='flex flex-col items-center w-80' onFinish={onFinish}>
        {data && data.reddit_token === '' ? (
          <div className='flex mb-2' onClick={onClickRedditLogin}>
            <Button type='primary'>Reddit Login</Button>
          </div>
        ) : (
          <>
            <Form.Item
              label='Target Subreddit'
              name='subreddit'
              className='w-full'
            >
              <AutoComplete
                options={
                  modSubreddits && modSubreddits.map((sub) => ({ value: sub }))
                }
              />
            </Form.Item>
            <Form.Item label='Target Range' name='after' className='w-full'>
              <Select>
                <Option value='3months'>last three months</Option>
                <Option value='month'>last month</Option>
                <Option value='2weeks'>last two weeks</Option>
                <Option value='week'>last week</Option>
                <Option value='day'>last day</Option>
              </Select>
            </Form.Item>
            <Form.Item label='Post Type' name='type' className='w-full'>
            <Select>
                <Option value='sub'>Submission Only</Option>
                <Option value='com'>Comment Only</Option>
                <Option value='all'>All Posts</Option>
              </Select>
            </Form.Item>
            <div>{postData?.count}</div>
            <Button onClick={onClickDeleteAll}>Delete all</Button>
            <div className='flex mb-2' onClick={onClickRedditLogout}>
              <Button type='primary' danger>
                Reddit Logout
              </Button>
            </div>
          </>
        )}

        <div className='flex'>
          <Button type='primary' htmlType='submit' loading={importLoading}>
            Import
          </Button>
          <Link to='/'>
            <Button className='ml-2'>Skip</Button>
          </Link>
        </div>
      </Form>
    </PageLayout>
  );
}

export default SettingsPage;
