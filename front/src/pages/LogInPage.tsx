import PageLayout from '@layouts/PageLayout';
import { IUser } from '@typings/db';
import request from '@utils/request';
import { Button, Form, Input } from 'antd';
import React, { ReactElement, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Link, Redirect } from 'react-router-dom';

interface LogInForm {
  username: string;
}

function LogInPage(): ReactElement {
  const { data, refetch } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    return data;
  });

  const onFinish = useCallback(
    (values: LogInForm) => {
      console.log(values);
      request<{ key: string }>({
        url: '/rest-auth/login/',
        method: 'POST',
        data: {
          username: values.username,
          password: 'modsandbox',
        },
      })
        .then((response) => {
          console.log('logged in');
          localStorage.setItem('token', response.data.key);
          refetch();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [refetch]
  );

  if (data) {
    console.log('logged in', data);
    return <Redirect to='/' />;
  }

  return (
    <PageLayout title='Login'>
      <Form className='flex flex-col items-center' onFinish={onFinish}>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input your username' }]}
        >
          <Input />
        </Form.Item>
        <div className='flex'>
          <Button type='primary' htmlType='submit'>
            Log In
          </Button>
          <Link to='/signup'>
            <Button className='ml-2'>Join</Button>
          </Link>
        </div>
      </Form>
    </PageLayout>
  );
}

export default LogInPage;
