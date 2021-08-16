import PageLayout from '@layouts/PageLayout';
import { IUser } from '@typings/db';
import request from '@utils/request';

import { Button, Form, Input } from 'antd';
import { ReactElement, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Redirect, useParams } from 'react-router-dom';

interface LogInForm {
  username: string;
}

function LogInPage(): ReactElement {
  const { data, refetch } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({
      url: '/rest-auth/user/',
    });
    return data;
  });

  const availableCondition = ['baseline', 'sandbox', 'modsandbox'];

  const { condition, order } =
    useParams<{ condition: string; order: string }>();

  const onFinish = useCallback(
    (values: LogInForm) => {
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
        .catch(() => {
          request<{ key: string }>({
            url: '/rest-auth/registration/',
            method: 'POST',
            data: {
              username: values.username,
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
    [refetch]
  );

  if (!availableCondition.includes(condition)) {
    return <Redirect to='/login/baseline/1' />;
  }

  if (data) {
    if (data.username === 'eval') {
      return <Redirect to='/eval/modsandbox/example' />;
    }
    if (order === '1') {
      return <Redirect to={`/home/baseline/A1`} />;
    } else if (order === '2') {
      return <Redirect to={`/home/baseline/B2`} />;
    }
    if (order === 'example') {
      return <Redirect to={`/home/${condition}/example`} />;
    }
  }

  const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 14 },
  };

  return (
    <PageLayout title='Join'>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item
          label='Reddit username'
          name='username'
          rules={[{ required: true, message: 'Please input your username' }]}
        >
          <Input />
        </Form.Item>
        <div className='flex justify-center'>
          <Button type='primary' htmlType='submit'>
            Start Task
          </Button>
        </div>
      </Form>
    </PageLayout>
  );
}

export default LogInPage;
