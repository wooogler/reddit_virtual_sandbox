import PageLayout from '@layouts/PageLayout';
import { IUser } from '@typings/db';
import request from '@utils/request';
import { Button, Form, Input } from 'antd';
import { ReactElement, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Link, Redirect } from 'react-router-dom';

interface SignUpForm {
  username: string;
}

function SignUpPage(): ReactElement {
  const { data, refetch } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    return data;
  });

  const onFinish = useCallback(
    (values: SignUpForm) => {
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
    },
    [refetch]
  );

  if (data) {
    return <Redirect to='/' />;
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <PageLayout title='Join'>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input your username' }]}
        >
          <Input />
        </Form.Item>
        <div className='flex justify-center'>
          <Button type='primary' htmlType='submit'>
            Sign Up
          </Button>
          <Link to='/login'>
            <Button className='ml-2'>Cancel</Button>
          </Link>
        </div>
      </Form>
    </PageLayout>
  );
}

export default SignUpPage;
