import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import HomePage from './pages/HomePage';

function App() {
  return (
    <>
      <GlobalStyles />
      <Switch>
        <Route path="/" exact component={HomePage} />
      </Switch>
    </>
  );
}

export default App;
