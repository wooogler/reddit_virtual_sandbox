import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import { RootState } from '../../modules';

function SignupFormContainer() {
  const token = useSelector((state: RootState) => state.user.token);
  const history = useHistory();
  const error = useSelector((state: RootState) => state.user.error);
  
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      history.replace('/')
    }
  }, [token, history]);

  return <SignupForm error={error}/>;
}

export default SignupFormContainer;