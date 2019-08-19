import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const WelcomePage = () => {
    const {isAuthenticated, doLogout} = useContext(AuthContext);
    return ( 
        <div>
            You Are currently logged {isAuthenticated? 'in': 'out' }. 
            <button onClick={doLogout}>Logout</button>
        </div>
     );
}
 
export default WelcomePage;