const moment = require('moment');
const localStorage = new (require('node-localstorage').LocalStorage)('./local_storage');
const _ = require('lodash');

class ProxyAPI {
    #rank = [];
    #lastUpdateTime = null;
    decayConstant = null;
    job = null;
    proxyRegistry = '';

    constructor(configuration, rpc) {
        this.rpc = rpc;
        this.minVotes = configuration['proxy_min_votes'];
        this.proxyRegistry = configuration['proxy_registry'];
        this.updateInterval = configuration['proxy_fetch_interval'];
        this.#lastUpdateTime = localStorage.getItem('proxy_list_update');
        this.#rank = JSON.parse(localStorage.getItem('proxies'));
        console.log(Date.now() - parseInt(this.#lastUpdateTime));
        if (Date.now() - parseInt(this.#lastUpdateTime) > (1000 * this.updateInterval)) {
            // Requires an update
            this.update().catch(console.log);
        }
    }

    get rank() {
        return this.#rank;
    }

    setScheduler() {
        this.job = setInterval(() => {
            this.update().catch(console.log);
        }, this.updateInterval * 1000);
    }

    updateDecay() {
        const a = (moment().unix() - 946684800);
        this.decayConstant = Math.pow(2, ((a / 604800) / 52));
    }

    convertVoteWeight(value) {
        return (parseFloat(value) / this.decayConstant / 10000);
    }

    async getProxyVotes(account) {
        const result = await this.rpc.get_table_rows({
            code: 'eosio',
            scope: 'eosio',
            table: 'voters',
            lower_bound: account,
            limit: 1
        });
        return {
            eos: this.convertVoteWeight(result.rows[0]['last_vote_weight']),
            producers: result.rows[0]['producers']
        };
    }

    async update() {
        console.log('updating proxy list...');
        const tempArray = [];
        const data = await this.rpc.get_table_rows({
            code: this.proxyRegistry,
            scope: this.proxyRegistry,
            table: 'proxies',
            limit: 1000
        });
        console.log(`${data.rows.length} proxies on the registry`);
        // Check vote weight for each proxy
        this.updateDecay();
        console.log('Current vote decay constant:', this.decayConstant);
        for (const proxy of data.rows) {
            const voter_info = await this.getProxyVotes(proxy['owner']);
            if (voter_info.eos > this.minVotes) {
                tempArray.push({
                    owner: proxy['owner'],
                    votes: voter_info.eos,
                    producers: voter_info.producers,
                    info: _.omit(proxy, ['owner'])
                });
            }
        }
        tempArray.sort((a, b) => b.votes - a.votes);
        console.log(`${this.#rank.length} proxies with more than ${this.minVotes} EOS Voted`);
        this.#lastUpdateTime = Date.now();
        this.#rank = tempArray;
        localStorage.setItem('proxy_list_update', this.#lastUpdateTime);
        localStorage.setItem('proxies', JSON.stringify(this.rank));
    }
}

module.exports = {
    ProxyAPI
};
