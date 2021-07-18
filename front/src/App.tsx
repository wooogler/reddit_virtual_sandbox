import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import HomePage from '@pages/HomePage';
import LogInPage from '@pages/LogInPage';
import FinishPage from '@pages/FinishPage';

function App() {
  return (
    <Switch>
      <Route path='/login/:condition?/:order' component={LogInPage} />
      <Route path='/home/:condition/:task' component={HomePage} />
      <Route path='/finish' component={FinishPage} />
      {/* <Route path='/signup' component={SignUpPage} /> */}
    </Switch>
  );
}

export default App;
