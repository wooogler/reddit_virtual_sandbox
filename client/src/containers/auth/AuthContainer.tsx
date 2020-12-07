import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../modules';
import { getUserInfo, login, userSelector } from '../../modules/user/slice';

function AuthContainer() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  
  useEffect(() => {
    console.log(token);
    const localToken = localStorage.getItem('token');
    console.log(localToken);
    if(!localToken) {
      history.push('/login');
    } else {
      dispatch(getUserInfo(localToken));
    }
  }, [token, history, dispatch]);
  return <div></div>;
}

export default AuthContainer;
