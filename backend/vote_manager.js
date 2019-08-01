import {JsSignatureProvider} from "eosjs/dist/eosjs-jssig";

const ecc = require('eosjs-ecc');
const {Api, JsonRpc, RpcError} = require('eosjs');

class VoteManager {
    #accounts = [];
    #validAccounts = [];
    #ready = false;
    rpc = null;
    api = null;


    constructor(configuration, rpc) {
        this.rpc = rpc;
        this.#accounts = configuration['accounts'];
        this.verifyPermissions().then((status) => {
            if (status) {
                this.#ready = true;
            }
        });
    }

    initApi(pvt_key) {
        const signatureProvider = new JsSignatureProvider([pvt_key]);
        this.api = new Api({
            rpc: this.rpc,
            signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
        });
    }

    async execVote(acc, proxy, prods) {
        try {
            const result = await this.api['transact']({
                actions: [VoteManager.voteAction(acc.account, acc.permission, proxy, prods)]
            });
            console.log(result);
        } catch (e) {
            console.log('\nCaught exception: ' + e);
            if (e instanceof RpcError)
                console.log(JSON.stringify(e.json, null, 2));
        }
    }


    static voteAction(actor, perm, proxy, prods) {
        return {
            account: 'eosio',
            name: 'voteprodtucer',
            authorization: [{
                actor: actor,
                permission: perm,
            }],
            data: {
                voter: actor,
                proxy: proxy,
                producers: prods
            },
        };
    }

    async executeVotes(refresh) {
        for (const acc of this.#accounts) {
            this.initApi(acc['private_key']);
            let proxy = '';
            let prods = [];
            if (refresh) {
                const voterData = (await this.rpc['get_account'](acc.account));
                if (voterData['voter_info']) {
                    prods = voterData['voter_info'].producers;
                    proxy = voterData['voter_info'].proxy;
                    await this.execVote(acc, proxy, prods);
                }
            }
        }
    }

    async verifyPermissions() {
        for (const acc of this.#accounts) {
            const accountData = await this.rpc['get_account'](acc.account);
            const existingPerm = accountData.permissions.find(p => p['perm_name'] === acc.permission);
            const pubkey = existingPerm['required_auth']['keys'][0]['key'];
            if (pubkey === ecc.privateToPublic(acc['private_key'])) {
                this.#validAccounts.push(acc);
            }
        }
        console.log(`${this.#validAccounts.length} valid accounts added`);
        return this.#validAccounts.length > 0;
    }
}

module.exports = {
    VoteManager
};
