import React, { createContext, useState } from 'react';

export const ProxyContext = createContext();

const ProxyContextProvider = (props) => {
    const [proxyList, setProxyList] = useState(
        [
            { id: 1, rank: 1, logo: 'https://img.bafang.com/cdn/assets/imgs/MjAxOTg/C3B8310FFC1B46DA82C8ED7910C2AD61.png', name: 'OKEx Pool', country: 'CN' },
            { id: 2, rank: 2, logo: 'https://storage.googleapis.com/static-61cdd52e-15d8-4b00-9e92-b7052710674d/logo/bigone/logo_256.png', name: 'BigONE', country: 'CN'},
            { id: 3, rank: 3, logo: 'https://www.alohaeos.com/media/2018/06/14/p/o/m/eoslaomaocom/mqyfD-2.png', name: 'EOSLaoMao', country: 'JP'},
            //...
            { id: 4, rank: 8, logo: 'https://www.alohaeos.com/media/2018/06/14/p/s/1/bitfinexeos1/X8Dr-2.png', name: 'Bitfinex', country: 'VG'},
            //...
            { id: 5, rank: 69, logo: 'https://www.alohaeos.com/media/2018/06/14/p/b/p/eosphereiobp/m3doB-2.png', name: 'EOSphere', country: 'AU'}
        ]
    );
    const [selectedProxyIdx, setSelectedProxyIdx] = useState(null);
    const [selectedProxyDetail, setSelectedProxyDetail] = useState(null);

    const doSelectProxy = (idx) => {
        //@TODO: please note distinction with ID and Array Idx.
        // currently I'm using ID externally and IDX here because
        // I believe getting the select proxy details will be replaced
        // by an API call to the backend, so just mocking here
        setSelectedProxyIdx(idx);
        setSelectedProxyDetail({
            ...proxyList[idx-1], 
            displayPic: "https://www.alohaeos.com/media/2018/06/14/p/o/l/eoshuobipool/mBu71-2.png",
            url: `https://${proxyList[idx-1].name}.io`,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        });
    }

    const defaultContext = {
        proxyList,
        selectedProxyIdx,
        doSelectProxy,
        selectedProxyDetail
    }

    return (
        <ProxyContext.Provider value={{...defaultContext}}>
            {props.children}
        </ProxyContext.Provider>
    )

}

export default ProxyContextProvider;