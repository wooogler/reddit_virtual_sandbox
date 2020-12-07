import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userSelector } from '../../modules/user/slice';

function AuthContainer() {
  const history = useHistory();
  const token = useSelector(userSelector.token);
  
  useEffect(() => {
    if (!token) {
      history.push('/login');
    }
    return;
  }, [history, token]);
  return <div></div>;
}

export default AuthContainer;
