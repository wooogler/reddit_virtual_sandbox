import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { signup } from '../../modules/user/slice';
import {Button, Input} from 'antd';
import { RootState } from '../../modules';

interface SignupFormProps {
}

function SignupForm({}: SignupFormProps) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const history = useHistory();
  const error = useSelector((state: RootState) => state.user.error);
  
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      history.replace('/')
    }
  }, [token, history]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: 'dltkd627',
    },
    onSubmit: (values) => {
      dispatch(signup(values));
    },
  });

  return (
    <SignupFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Sign up</div>
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
