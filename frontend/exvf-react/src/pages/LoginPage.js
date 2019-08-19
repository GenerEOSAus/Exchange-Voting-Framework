import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = (props) => {
    const {doLogin} = useContext(AuthContext);
    const handleLogin = () => {
        doLogin(props.history);
    }
    return ( 
        <div className="page_login">
            <button onClick={handleLogin}>Login</button>
        </div>
     );
}
 
export default LoginPage;
