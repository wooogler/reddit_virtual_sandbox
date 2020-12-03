import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <>
      <GlobalStyles />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
      </Switch>
    </>
  );
}

export default App;
