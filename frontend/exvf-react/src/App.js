import React from 'react';
import { Router } from 'react-router';
import { Route, Switch } from 'react-router-dom'
import history from './history';
import ProtectedRoute from './components/ProtectedRoute';
import AuthContextProvider from './contexts/AuthContext';
import PageTemplate from './components/PageTemplate';

import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import VotingPage from './pages/VotingPage';


function App() {
  return (
    <Router history={history}>
      <AuthContextProvider>
        <PageTemplate>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute  exact path="/" component={WelcomePage} />
            <ProtectedRoute  exact path="/home" component={WelcomePage} />          
            <Route  exact path="/vote" component={VotingPage} />
          </Switch>
        </PageTemplate>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
