import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';


const ProtectedRoute = (props) => {
    const isAuthenticated = useContext(AuthContext); 
    console.log('abc', isAuthenticated);
    const { component: Component, ...otherProps } = props
  
    return (
        <Route 
          {...otherProps} 
          render={props => (
            isAuthenticated ?
              <Component {...props} /> :
              <Redirect to='/login' />
          )} 
        />
      );
}
 
export default ProtectedRoute;
