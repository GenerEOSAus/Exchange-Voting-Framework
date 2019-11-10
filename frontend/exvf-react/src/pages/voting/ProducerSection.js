import React from 'react';
import ProducerVoteList from '../../components/ProducerVoteList';
import ProducerContextProvider from '../../contexts/ProducerContext';
import ProducerVoteDetail from '../../components/ProducerVoteDetail';

const ProducerSection = (props) => {
    return ( 
        <ProducerContextProvider>
            <div className="section_producer">
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
 
export default ProducerSection;