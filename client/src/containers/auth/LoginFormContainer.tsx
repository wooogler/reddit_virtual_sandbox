import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { RootState } from '../../modules';

function LoginFormContainer() {
  const token = useSelector((state: RootState) => state.user.token);
  const error = useSelector((state: RootState) => state.user.error);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      history.replace('/');
    }
  }, [token, history]);

  return <LoginForm error={error} />;
}

export default LoginFormContainer;
