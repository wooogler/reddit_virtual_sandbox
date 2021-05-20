import React from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import './App.css';

const HomePage = loadable(() => import('@pages/HomePage'));
const LogInPage = loadable(() => import('@pages/LogInPage'));
const SignUpPage = loadable(() => import('@pages/SignUpPage'));
const SettingsPage = loadable(() => import('@pages/SettingsPage'));

function App() {
  return (
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route path='/login' component={LogInPage} />
      <Route path='/signup' component={SignUpPage} />
      <Route path='/settings' component={SettingsPage} />
    </Switch>
  );
}

export default App;
