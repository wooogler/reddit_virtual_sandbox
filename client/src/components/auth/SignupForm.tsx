import { useFormik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { signup } from '../../modules/user/slice';
import {Button, Input} from 'antd';

interface SignupFormProps {
  error: Error | null;
}

function SignupForm({error}: SignupFormProps) {
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      dispatch(signup(values));
    },
  });

  return (
    <SignupFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Sign up</div>
      <label htmlFor="username">USERNAME</label>
      <Input
        name="username"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.username}
        autoComplete="off"
      />
      <label htmlFor="password">PASSWORD</label>
      <Input
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
        autoComplete="off"
      />
      <div>{error && 'username already exists'}</div>
      <div className="button-group">
        <Button type='primary' size="large" htmlType="submit">
          SIGN UP
        </Button>
        <Link to='/login'>
          <Button size="large">
            CANCEL
          </Button>
        </Link>
      </div>
    </SignupFormDiv>
  );
}

const SignupFormDiv = styled.form`
  display: flex;
  background: white;
  padding: 2rem;
  flex-direction: column;
  .title {
    font-size: 2rem;
  }
  label {
    margin-left: 0.1rem;
    margin-bottom: 0.3rem;
    font-size: 0.7rem;
    font-weight: bold;
    margin-top: 1rem;
  }
  input {
    font-size: 1rem;
    width: 20rem;
  }
  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    a {
      text-decoration: none;
      margin-left: 1rem;
    }
  }
`;

export default SignupForm;
