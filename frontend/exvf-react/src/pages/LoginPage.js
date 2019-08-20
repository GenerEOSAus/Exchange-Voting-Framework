import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = (props) => {
    const {doLogin} = useContext(AuthContext);

    return ( 
        <div className="page_login">
            <button onClick={doLogin}>Login</button>
        </div>
     );
}
 
export default LoginPage;
