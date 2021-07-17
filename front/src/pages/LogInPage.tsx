import PageLayout from '@layouts/PageLayout';
import { IUser } from '@typings/db';
import request from '@utils/request';
import { Condition, useStore } from '@utils/store';
import { Button, Form, Input, Select } from 'antd';
import React, { ReactElement, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';

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
  const [task, setTask] = useState<'A' | 'B' | 'C'>('A');

  const onFinish = useCallback(
    (values: LogInForm) => {
      request<{ key: string }>({
        url: '/rest-auth/login/',
        method: 'POST',
        data: {
          username: values.username + '-' + task,
          password: 'modsandbox',
        },
      })
        .then((response) => {
          console.log('logged in');
          localStorage.setItem('token', response.data.key);
          refetch();
        })
        .catch(() => {
          request<{ key: string }>({
            url: '/rest-auth/registration/',
            method: 'POST',
            data: {
              username: values.username + '-' + task,
              password1: 'modsandbox',
              password2: 'modsandbox',
            },
          })
            .then((response) => {
              console.log(response);
              localStorage.setItem('token', response.data.key);
              refetch();
            })
            .catch((error) => {
              console.log(error.response);
            });
        });
    },
    [refetch, task]
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
    <PageLayout title='Join'>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item label='Condition' name='condition'>
          <Select
            value={condition}
            defaultValue={condition}
            onChange={(value: Condition) => changeCondition(value)}
          >
            <Select.Option value='modsandbox'>System A</Select.Option>
            <Select.Option value='sandbox'>System B</Select.Option>
            <Select.Option value='baseline'>System C</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='Task' name='task'>
          <Select
            value={task}
            defaultValue={'A'}
            onChange={(value) => setTask(value)}
          >
            <Select.Option value='A'>Task A</Select.Option>
            <Select.Option value='B'>Task B</Select.Option>
            <Select.Option value='C'>Example Task</Select.Option>
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
            Join
          </Button>
          {/* <Link to='/signup'>
            <Button className='ml-2'>Join</Button>
          </Link> */}
        </div>
      </Form>
    </PageLayout>
  );
}

export default LogInPage;
