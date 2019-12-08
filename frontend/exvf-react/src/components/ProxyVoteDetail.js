import React, { useContext } from 'react';
import { ProxyContext } from '../contexts/ProxyContext';

const ProxyVoteDetail = (props) => {
    const proxy = useContext(ProxyContext).selectedProxyDetail;
    console.log("Proxy Vote Detail Showing: ", proxy)
    if(proxy != null) {
        return ( 
            <div className="proxy-vote-detail">
                <h3>{proxy.info.name}</h3>
                <div className="displaypic">
                    <img src={proxy.info.logo_256} width="100"/>
                </div>
                <div className="proxyName">
                    {proxy.info.slogan}
                </div>
                <div className="proxyUrl">
                    <a href={proxy.info.website} target="_blank">{proxy.info.website}</a>
                </div>
                <div className="proxyBackground panel">
                    <header>Background</header>
                    {proxy.info.background}
                </div>
                <div className="proxyDescription panel">
                    <header>Voting Philosophy</header>
                    {proxy.info.philosophy}
                </div>
                
                <button onClick={()=>console.log('TODO: call voting')}>Vote</button>
            </div>
        );
    } else {
        return (<div></div>);
    }

}
 
export default ProxyVoteDetail;
