import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AuthContainer from './containers/auth/AuthContainer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
      </Switch>
      <AuthContainer />
    </>
  );
}

export default App;
