import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import HomePage from '@pages/HomePage';
import LogInPage from '@pages/LogInPage';
import FinishPage from '@pages/FinishPage';
import EvalPage from '@pages/EvalPage';
import OverviewPage from '@pages/OverviewPage';
import DiscordPage from '@pages/DiscordPage';
import QuizPage from '@pages/QuizPage';
import PostSurveyPage from '@pages/PostSurveyPage';
import DemoPage from '@pages/DemoPage';
import CheckPage from '@pages/CheckPage';

function App() {
  return (
    <Switch>
      <Route path='/overview/:condition' component={OverviewPage} />
      <Route path='/discord/:condition' component={DiscordPage} />
      <Route path='/quiz/:condition' component={QuizPage} />
      <Route path='/check/:condition/' component={CheckPage} />
      <Route path='/login/:condition?/:order' component={LogInPage} />
      <Route path='/home/:condition/:task' component={HomePage} />
      <Route path='/survey/:condition/:task' component={PostSurveyPage} />
      <Route path='/demo/:condition' component={DemoPage} />
      <Route path='/finish' component={FinishPage} />
      <Route path='/eval/:condition/:task' component={EvalPage} />
      {/* <Route path='/signup' component={SignUpPage} /> */}
    </Switch>
  );
}

export default App;
