import React, { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { ProducerContext } from '../contexts/ProducerContext';
import '../flags.css'

const ProducerVoteList = (props) => {

  const {producerList, doSelectProducer} = useContext(ProducerContext);

    //@TODO: data to be replaced with data from backend
    const data = [
      { id: 1, rank: 1, logo: 'https://img.bafang.com/cdn/assets/imgs/MjAxOTg/C3B8310FFC1B46DA82C8ED7910C2AD61.png', name: 'OKEx Pool', country: 'CN' },
      { id: 2, rank: 2, logo: 'https://storage.googleapis.com/static-61cdd52e-15d8-4b00-9e92-b7052710674d/logo/bigone/logo_256.png', name: 'BigONE', country: 'CN'},
      { id: 3, rank: 3, logo: 'https://www.alohaeos.com/media/2018/06/14/p/o/m/eoslaomaocom/mqyfD-2.png', name: 'EOSLaoMao', country: 'JP'},
      //...
      { id: 4, rank: 8, logo: 'https://www.alohaeos.com/media/2018/06/14/p/s/1/bitfinexeos1/X8Dr-2.png', name: 'Bitfinex', country: 'VG'},
      //...
      { id: 5, rank: 69, logo: 'https://www.alohaeos.com/media/2018/06/14/p/b/p/eosphereiobp/m3doB-2.png', name: 'EOSphere', country: 'AU'}
    ];

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
        cell: row => <div><img width="20" src={row.logo} /></div>
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