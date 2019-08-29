import React from 'react';
import ProxyVoteList from '../components/ProxyVoteList';
import ProxyContextProvider from '../contexts/ProxyContext';
import ProxyVoteDetail from '../components/ProxyVoteDetail';

const ProxyPage = (props) => {
    return ( 
        <ProxyContextProvider>
            <div className="page_proxy">
                <div className="section-left">
                    <ProxyVoteList />
                </div>
                <div className="section-right">
                    <ProxyVoteDetail />
                </div>
            </div>
        </ProxyContextProvider>
     );
}
 
export default ProxyPage;