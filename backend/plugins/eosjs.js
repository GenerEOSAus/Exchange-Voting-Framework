const fp = require('fastify-plugin');
const conf = require('../config.json');
const {Api} = require("eosjs");
const {JsonRpc} = require('eosjs');
const fetch = require('node-fetch');

module.exports = fp(async (fastify, options, next) => {
    const rpc = new JsonRpc(conf.endpoint, {fetch});
    const chain_data = await rpc.get_info();
    const api = new Api({
        rpc,
        signatureProvider: null,
        chainId: chain_data.chain_id,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
    });
    fastify.decorate('eosjs', {api, rpc});
    next();
}, {
    fastify: '>=2.0.0',
    name: 'fastify-eosjs'
});
