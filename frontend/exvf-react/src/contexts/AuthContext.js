import React, { createContext, useState, useEffect } from 'react';
import history from '../history';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const prevAuth = window.localStorage.getItem('auth') || false;
    const prevAuthBody = window.localStorage.getItem('authBody') || null;
    const [authenticated, setAuthenticated] = useState(prevAuth)
    const [authBody, setAuthBody] = useState(prevAuthBody);

    useEffect(
        () => {
          window.localStorage.setItem('authenticated', authenticated);
          window.localStorage.setItem('authBody', authBody);
        },
        [authenticated, authBody]
      );

    const doLogin = (username, password) =>{
        setAuthenticated(true);
        history.push('/home');
    }
    const doLogout = () =>{
        setAuthenticated(false);
        console.log('logout history', history);
        history.push('/login');
    }

    const defaultContext = {
        authenticated,
        authBody,
        doLogin,
        doLogout
    };

    return ( 
        <AuthContext.Provider value={{...defaultContext}}>
            {props.children}
        </AuthContext.Provider>
     );
}
 
export default AuthContextProvider;