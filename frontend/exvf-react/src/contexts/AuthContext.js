import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [authInfo, setAuthInfo] = useState({
        isAuthenticated: false
    })
    const doLogin = (history=undefined) =>{
        setAuthInfo({isAuthenticated: true});
        if(history) history.push('/welcome');
    }
    const doLogout = (history=undefined) =>{
        setAuthInfo({isAuthenticated: false});
        if(history) history.push('/login');
    }

    return ( 
        <AuthContext.Provider value={{...authInfo, doLogin, doLogout}}>
            {props.children}
        </AuthContext.Provider>
     );
}
 
export default AuthContextProvider;