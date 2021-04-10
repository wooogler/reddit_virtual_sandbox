import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../../modules/user/slice';
import {Button, Input} from 'antd';
import { RootState } from '../../modules';

interface LoginFormProps {
}

function LoginForm({}: LoginFormProps) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const error = useSelector((state: RootState) => state.user.error);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      history.replace('/');
    }
  }, [token, history]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: 'dltkd627',
    },
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  return (
    <LoginFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Login</div>
      <label htmlFor="username">Worker ID</label>
      <Input
        name="username"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.username}
        autoComplete="off"
      />
      <div>{error && error.message}</div>
      <div className="button-group">
        <Button size="large" type="primary" htmlType='submit'>
          LOG IN
        </Button>
        <Link to="/signup">
          <Button size="large">
            SIGN UP
          </Button>
        </Link>
      </div>
    </LoginFormDiv>
  );
}

const LoginFormDiv = styled.form`
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

export default LoginForm;
