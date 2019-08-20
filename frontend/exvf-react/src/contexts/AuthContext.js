import React, { createContext, useState } from 'react';
import history from '../history';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [authInfo, setAuthInfo] = useState({
        isAuthenticated: false
    })
    const doLogin = () =>{
        setAuthInfo({isAuthenticated: true});
        history.push('/home');
        
    }
    const doLogout = () =>{
        setAuthInfo({isAuthenticated: false});
        console.log('logout history', history);
        history.push('/login');
    }

    return ( 
        <AuthContext.Provider value={{...authInfo, doLogin, doLogout}}>
            {props.children}
        </AuthContext.Provider>
     );
}
 
export default AuthContextProvider;