import { useFormik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../common/Button';

function SignupForm() {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {},
  });

  return (
    <SignupFormDiv onSubmit={formik.handleSubmit}>
      <div className="title">Sign up</div>
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
        value={formik.values.username}
        autoComplete="off"
      />
      <div className="button-group">
        <Button size="large" type="submit">
          SIGN UP
        </Button>
        <Link to='/login' style={{textDecoration: 'none'}}>
          <Button size="large" color="red">
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

export default SignupForm;
