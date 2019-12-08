import React, { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { ProducerContext } from '../contexts/ProducerContext';
import '../flags.css'


const ProducerVoteList = (props) => {

    const {producerList, doSelectProducer} = useContext(ProducerContext);

    const columns = [
      {
        name: 'Rank',
        selector: 'rank',
        sortable: true,
        cell: row => <div>
          <input type="radio" name="proxySelection" value={row.id} onClick={handleProxySelection}/>
          &nbsp;
          {row.rank}
        </div>
      },
      {
        name: '',
        sortable: false,
        cell: row => <div><img width="20" src={row.logo} alt="logo"/></div>
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
      },
      {
        name: 'Country',
        sortable: true,
        selector: 'country',
        right: true,
        cell: row => <div>{row.country} <span className={`flag-icon flag-icon-${row.country?row.country.toLowerCase():''}`} /></div>
      },
    ];

    const handleProxySelection = (e) => {
      doSelectProducer(e.target.value);
    }

    return ( 
        <div className="proxy-vote-list">
            <header>Producer Candidates</header>
            <DataTable
                columns={columns}
                data={producerList}
            />
        </div>
     );
}


export default ProducerVoteList;
