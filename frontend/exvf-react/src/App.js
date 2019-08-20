import React from 'react';
import { Router } from 'react-router';
import { Route, Switch } from 'react-router-dom'
import history from './history';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import AuthContextProvider from './contexts/AuthContext';
import PageTemplate from './components/PageTemplate';
import ProxyVoteList from './components/ProxyVoteList';

function App() {
  return (
    <Router history={history}>
      <AuthContextProvider>
        <PageTemplate>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute  exact path="/" component={WelcomePage} />
            <ProtectedRoute  exact path="/home" component={WelcomePage} />          
            <Route  exact path="/vote" component={ProxyVoteList} />
          </Switch>
        </PageTemplate>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
