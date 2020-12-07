import { useFormik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../../modules/user/slice';
import Button from '../common/Button';

interface LoginFormProps {
  error: Error | null;
}

function LoginForm({error}: LoginFormProps) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  return (
    <LoginFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Login</div>
      <label htmlFor="username">USERNAME</label>
      <input
        name="username"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.username}
        autoComplete="off"
      />
      <label htmlFor="password">PASSWORD</label>
      <input
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
        autoComplete="off"
      />
      <div>{error && 'Please check your username and password'}</div>
      <div className="button-group">
        <Button size="large" type="submit">
          LOG IN
        </Button>
        <Link to="/signup">
          <Button size="large" color="red">
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
    font-family: sans-serif;
    border: 1px solid #ccc;
    padding: 0.5rem;
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
