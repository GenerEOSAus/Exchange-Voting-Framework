import React from 'react';

const ProxyVoteList = (props) => {
    return ( 
        <div className="proxy-vote-list">
            <header>Candidate Votes</header>
            <table responsive="lg">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th></th>
                        <th>Name</th>
                        <th>Country</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
     );
}
 
export default ProxyVoteList;