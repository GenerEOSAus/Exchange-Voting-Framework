const {User} = require('../models');

const auth_handler = async (request, reply) => {

};

async function routes(fastify, options) {


    // Include new user
    fastify.route({
        method: "POST",
        url: '/adduser',
        handler: async (request, reply) => {
            await new User(request.body).save();
            reply.send({status: "OK"})
        }
    });

    // Submit User Details
    fastify.route({
        method: "POST",
        url: '/setuser',
        handler: async (request, reply) => {
            const user = await User.findOne({
                user_id: request.body.user_id
            });
            if (user) {
                if (request.body.balance !== '') {
                    user.eos_balance = request.body.balance;
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
}

module.exports = routes;
