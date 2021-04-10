import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { RootState } from './modules';
import { getUserInfo } from './modules/user/slice';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (!localToken) {
      history.push('/login');
    } else {
      dispatch(getUserInfo(localToken));
    }
  }, [token, history, dispatch]);

  return (
    <>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
      </Switch>
    </>
  );
}

export default App;
