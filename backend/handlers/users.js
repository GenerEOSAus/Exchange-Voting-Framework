const {ProxyAPI} = require("../proxy_api");
const {User} = require('../models');
const conf = require('../config.json');
const auth_handler = async (request, reply) => {

};

function parseRequestLimits(request) {
    let skip = 0;
    if (request.query.skip) {
        skip = parseInt(request.query.skip);
    }
    let limit = 20;
    if (request.query.limit) {
        limit = parseInt(request.query.limit);
    }
    return {skip, limit};
}

async function routes(fastify, options) {

    const {proxyApi, voteManager} = fastify['exvf'];

    // Get Auth Token
    fastify.route({
        method: "POST",
        url: '/api/auth',
        handler: auth_handler
    });

    // Get User Vote
    fastify.route({
        method: "GET",
        url: '/voter',
        handler: async (request, reply) => {
            const user = await User.findOne({
                user_id: request.query.id
            });
            return user;
        }
    });

    // Submit User Vote
    fastify.route({
        method: "POST",
        url: '/setvote',
        handler: async (request, reply) => {
            const user = await User.findOne({
                user_id: request.body.user_id
            });
            if (user) {
                if (request.body.proxy !== '') {
                    user.proxy = request.body.proxy;
                    user.producers = [];
                    user.last_vote = new Date();
                } else if (request.body.producers.length > 0) {
                    const arr = request.body.producers;
                    arr.sort();
                    user.producers = arr;
                    user.proxy = '';
                    user.last_vote = new Date();
                }
                await user.save();
                reply.send({status: "OK"});
            } else {
                reply.send({
                    status: "FAIL",
                    reason: 'user not found'
                });
            }
        }
    });

    // Get Producers
    fastify.route({
        method: "GET",
        url: '/producers',
        handler: async (request, reply) => {
            const {skip, limit} = parseRequestLimits(request);
            reply.send(proxyApi.producers.slice(skip, skip + limit));
        }
    });

    // Get Proxies
    fastify.route({
        method: "GET",
        url: '/proxies',
        handler: async (request, reply) => {
            const {skip, limit} = parseRequestLimits(request);
            reply.send(proxyApi.rank.slice(skip, skip + limit));
        }
    });

}

module.exports = routes;
