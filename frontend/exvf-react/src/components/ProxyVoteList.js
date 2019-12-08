import React, { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { ProxyContext } from '../contexts/ProxyContext';
import '../flags.css'

const ProxyVoteList = (props) => {

    const {proxyList, doSelectProxy} = useContext(ProxyContext);

    const columns = [
      {
        name: 'Votes',
        selector: 'votes',
        sortable: true,
        cell: row => <div>
          <input type="radio" name="proxySelection" value={row.id} onClick={handleProxySelection}/>
          &nbsp;
          <img width="20" src={row.info.logo_256} alt="logo"/>
          &nbsp;
          {row.info.name}
        </div>
      },
      {
        name: 'Slogan',
        sortable: false,
        selector: 'info.slogan',
        cell: row => <div>{row.info.slogan}</div>
      },
    ];

    const handleProxySelection = (e) => {
      doSelectProxy(e.target.value);
    }

    return ( 
        <div className="proxy-vote-list">
            <header>Proxy Candidates</header>
            <DataTable
                columns={columns}
                data={proxyList}
            />
        </div>
     );
}
 
export default ProxyVoteList;