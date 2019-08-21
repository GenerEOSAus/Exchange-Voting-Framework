import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';


const ProtectedRoute = (props) => {
    const {authenticated} = useContext(AuthContext); 
    //console.log('abc', isAuthenticated);
    const { component: Component, ...otherProps } = props
  
    
    // useEffect(()=> {
    //   console.log('login updated', isAuthenticated);
    // }, [isAuthenticated]);
    

    const handleRender = (props) => {
      console.log('authenticated', authenticated);
      return authenticated? 
        <Component {...props} /> :
        <Redirect to='/login' />;
    }

    return (
        <Route 
          {...otherProps} 
          render={handleRender} 
        />
      );
}
 
export default ProtectedRoute;
