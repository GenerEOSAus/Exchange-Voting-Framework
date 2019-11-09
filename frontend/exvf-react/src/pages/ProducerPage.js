import React from 'react';
import ProducerVoteList from '../components/ProducerVoteList';
import ProducerContextProvider from '../contexts/ProducerContext';
import ProducerVoteDetail from '../components/ProducerVoteDetail';

const ProducerPage = (props) => {
    return ( 
        <ProducerContextProvider>
            <div className="page_producer">
                <div className="section-left">
                    <ProducerVoteList />
                </div>
                <div className="section-right">
                    <ProducerVoteDetail />
                </div>
            </div>
        </ProducerContextProvider>
     );
}
 
export default ProducerPage;