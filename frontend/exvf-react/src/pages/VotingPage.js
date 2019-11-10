import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ProducerSection from './voting/ProducerSection';
import ProxySection from './voting/ProxySection';

const VotingPage = (props) => {
    return (
        <div className="page page-voting">
            <Tabs>
                <TabList>
                <Tab>Producer</Tab>
                <Tab>Proxy</Tab>
                </TabList>

                <TabPanel>
                    <ProducerSection />
                </TabPanel>
                <TabPanel>
                    <ProxySection />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default VotingPage;