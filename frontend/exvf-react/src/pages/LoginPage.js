import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = (props) => {
    const {doLogin} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        doLogin(username, password);
    }

    return ( 
        <div className="page_login">
            <div className="login-panel panel">
                <header>Login</header>
                <form onSubmit={handleSubmit}>
                    <label>Username: </label>
                    <input type="text" required onChange={(e) => setUsername(e.target.value)} />
                    <br/>
                    <label>Password: </label>
                    <input type="password" required onChange={(e) => setPassword(e.target.value)} />
                    <br/>
                    <input type="submit" value="Login" />
                </form>
            </div>
        </div>
    );
}
 
export default LoginPage;
