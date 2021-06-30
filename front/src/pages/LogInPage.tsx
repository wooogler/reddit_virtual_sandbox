import PageLayout from '@layouts/PageLayout';
import { IUser } from '@typings/db';
import request from '@utils/request';
import { Condition, useStore } from '@utils/store';
import { Button, Form, Input, Select } from 'antd';
import React, { ReactElement, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Link, Redirect } from 'react-router-dom';

interface LogInForm {
  username: string;
  condition: Condition;
}

function LogInPage(): ReactElement {
  const { data, refetch } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    return data;
  });

  const { condition, changeCondition } = useStore();

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
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <PageLayout title='Login'>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item label='Condition' name='condition'>
          <Select
            value={condition}
            defaultValue={condition}
            onChange={(value: Condition) => changeCondition(value)}
          >
            <Select.Option value='modsandbox'>ModSandbox</Select.Option>
            <Select.Option value='sandbox'>Sandbox</Select.Option>
            <Select.Option value='baseline'>Baseline</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input your username' }]}
        >
          <Input />
        </Form.Item>
        <div className='flex justify-center'>
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
