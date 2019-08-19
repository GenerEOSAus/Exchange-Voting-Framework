import React from 'react';
import Header from './Header';

const PageTemplate = (props) => {
    return ( 
        <div className="page_template">
            <Header />
            {props.children}
        </div>
     );
}
 
export default PageTemplate;