import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const WelcomePage = () => {
    const {authenticated, doLogout} = useContext(AuthContext);
    return ( 
        <div className="page page-welcome">
            You Are currently logged {authenticated? 'in': 'out' }. 
            <button onClick={doLogout}>Logout</button>
        </div>
     );
}
 
export default WelcomePage;