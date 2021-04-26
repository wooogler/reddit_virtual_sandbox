import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import HomePage from '@pages/HomePage';
import LogInPage from '@pages/LogInPage';
import SignUpPage from '@pages/SignUpPage';

function App() {
  return (
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route path='/login' component={LogInPage} />
      <Route path='/signup' component={SignUpPage} />
    </Switch>
  );
}

export default App;
