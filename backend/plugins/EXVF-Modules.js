const fp = require('fastify-plugin');
const conf = require('../config.json');
const {VoteManager} = require("../vote_manager");
const {ProxyAPI} = require("../proxy_api");

module.exports = fp(async (fastify, options, next) => {


    const proxyApi = new ProxyAPI(conf, fastify['eosjs'].rpc);
    proxyApi.setScheduler();
    // proxyApi.update();

    const voteManager = new VoteManager(conf, fastify['eosjs'].rpc);

    fastify.decorate('exvf', {proxyApi, voteManager});
    next();
}, {
    fastify: '>=2.0.0',
    name: 'fastify-exvf',
    dependencies: [
        "fastify-eosjs"
    ]
});
