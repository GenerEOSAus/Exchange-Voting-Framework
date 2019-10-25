const moment = require('moment');
const got = require('got');
const localStorage = new (require('node-localstorage').LocalStorage)('./local_storage');
const _ = require('lodash');

class ProxyAPI {
    #rank = [];
    #producers = [];
    #lastUpdateTime = null;
    decayConstant = null;
    job = null;
    proxyRegistry = '';

    constructor(configuration, rpc) {
        this.rpc = rpc;
        this.minVotes = configuration['proxy_min_votes'];
        this.proxyRegistry = configuration['proxy_registry'];
        this.updateInterval = configuration['proxy_fetch_interval'];

        if (localStorage.getItem('proxy_list_update')) {
            this.#lastUpdateTime = parseInt(localStorage.getItem('proxy_list_update'));
        }

        this.#rank = JSON.parse(localStorage.getItem('proxies'));
        this.#producers = JSON.parse(localStorage.getItem('producers'));
        if (Date.now() - this.#lastUpdateTime > (1000 * this.updateInterval)) {
            // Requires an update
            console.log('Updating proxy list...');
            this.update().catch(console.log);
            console.log('Updating producers list...');
            this.updateProds().catch(console.log);
        } else {
            if (!this.#producers) {
                this.updateProds().catch(console.log);
            } else {
                if (this.#producers.length === 0) {
                    this.updateProds().catch(console.log);
                }
            }
        }
    }

    get rank() {
        return this.#rank;
    }

    get producers() {
        if (this.#producers) {
            return this.#producers;
        } else {
            return [];
        }
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

    async updateProds() {
        console.log('updating producers list...');
        const tempArray = [];
        const data = await this.rpc.get_table_rows({
            code: 'eosio',
            scope: 'eosio',
            table: 'producers',
            limit: 1000
        });

        // filter by valid url and convert votes
        for (const producer of data.rows) {
            if (producer.url !== '') {
                tempArray.push({
                    account: producer.owner,
                    url: producer.url,
                    votes: parseFloat(producer['total_votes']),
                    id: '',
                    rank: '',
                    logo: '',
                    name: '',
                    country: ''
                });
            }
        }

        // sort by votes
        tempArray.sort((a, b) => b.votes - a.votes);

        const tempArray2 = [];

        let position = 0;
        for (const producer of tempArray) {
            position++;
            if (tempArray2.length < 100) {
                // fill data from BP json
                let url, body;
                if (producer.url.endsWith('/')) {
                    url = producer.url + "bp.json";
                } else {
                    url = producer.url + "/bp.json";
                }

                try {
                    const savedBody = localStorage.getItem('bp-json-' + producer.account);
                    if (savedBody) {
                        body = savedBody;
                    } else {
                        body = (await got(url)).body;
                        localStorage.setItem('bp-json-' + producer.account, body);
                    }
                    try {
                        body = JSON.parse(body);
                        producer.id = position;
                        producer.rank = position;
                        if (body['org']) {
                            if (body['org']['candidate_name']) {
                                producer.name = body['org']['candidate_name'];
                            }
                            if (body['org']['branding']) {
                                if (body['org']['branding']['logo_256']) {
                                    producer.logo = body['org']['branding']['logo_256'];
                                }
                            }
                            if (body['org'].location) {
                                if (body['org'].location.country) {
                                    producer.country = body['org'].location.country;
                                }
                            }
                        }
                        console.log(producer);
                        tempArray2.push(producer);
                    } catch (e) {
                        console.log('failed to parse bp.json');
                    }
                } catch (e) {
                    console.log("failed to get bp.json for " + producer.account);
                }
            } else {
                break;
            }
        }

        console.log(`${tempArray2.length} producers registered`);
        this.#producers = tempArray2;
        localStorage.setItem('producers', JSON.stringify(this.producers));
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
        this.#lastUpdateTime = Date.now();
        this.#rank = tempArray;
        console.log(`${this.#rank.length} proxies with more than ${this.minVotes} EOS Voted`);
        localStorage.setItem('proxy_list_update', this.#lastUpdateTime);
        localStorage.setItem('proxies', JSON.stringify(this.rank));
    }
}

module.exports = {
    ProxyAPI
};
