import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import AuthContextProvider from './contexts/AuthContext';
import PageTemplate from './components/PageTemplate';

function App() {
  return (
    <AuthContextProvider>
      <PageTemplate>
        <Router>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <ProtectedRoute path="/" component={WelcomePage} />
            
          </Switch>
        </Router>
      </PageTemplate>
    </AuthContextProvider>
  );
}

export default App;
