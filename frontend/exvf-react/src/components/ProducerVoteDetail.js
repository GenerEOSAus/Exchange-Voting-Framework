import React, { useContext } from 'react';
import { ProducerContext } from '../contexts/ProducerContext';
import '../flags.css'

const ProducerVoteDetail = (props) => {
    const producer = useContext(ProducerContext).selectedProducerDetail;
    console.log("Producer Vote Detail Showing: ", producer)
    if(producer != null) {
        return ( 
            <div className="producer-vote-detail">
                <div className="displaypic">
                    <img src={producer.logo} width="100" alt="logo"/>
                </div>
                <div className="producerName">
                    
                </div>
                <div className="producerUrl">
                    <a href={producer.url} target="_blank">{producer.url}</a>
                </div>
                <div className="producerVotes">
                    Rank: {producer.rank}, Votes: {producer.votes}
                </div>
                <div className="producerCountry">
                    Country: {producer.country} <span className={`flag-icon flag-icon-${producer.country?producer.country.toLowerCase():''}`} />
                </div>
                <div className="producerDescription panel">
                    <header>Voting Philosophy</header>
                    {producer.description}
                </div>
                
                <button onClick={()=>console.log('TODO: call voting')}>Vote</button>
            </div>
        );
    } else {
        return (<div></div>);
    }

}
 
export default ProducerVoteDetail;
