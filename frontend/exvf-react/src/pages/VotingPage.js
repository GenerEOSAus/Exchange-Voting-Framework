import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ProducerPage from './ProducerPage';
import ProxyPage from './ProxyPage';

const VotingPage = (props) => {
    return (
        <div className="page-voting">
            <Tabs>
                <TabList>
                <Tab>Producer</Tab>
                <Tab>Proxy</Tab>
                </TabList>

                <TabPanel>
                    <ProducerPage />
                </TabPanel>
                <TabPanel>
                    <ProxyPage />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default VotingPage;