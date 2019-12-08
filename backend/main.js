const fastify = require('fastify')({logger: false});
const _ = require('lodash');
const {User} = require('./models');

fastify.register(require('./plugins/eosjs'));

fastify.register(require('./plugins/EXVF-Modules'));

// register public facing apis
fastify.register(require('./handlers/users'), {
    prefix: '/api'
});

// register private apis
fastify.register(require('./handlers/admin'), {
    prefix: '/api'
});

//@TODO: for dev, allow for CORS - to remove in prod
fastify.register(require('fastify-cors'), { 
    // put your options here
    //https://www.npmjs.com/package/fastify-cors
    // origin: ["http://localhost:8080"]
})

const proxy_list = [];
const proxy_votes = new Map();
const producer_list = [];

async function getProxyBPs(proxy) {
    if (proxy_votes.has(proxy)) {
        return proxy_votes.get(proxy);
    } else {
        const results = await rpc.get_account(proxy);
        const prods = results['voter_info']['producers'];
        proxy_votes.set(proxy, prods);
        return prods;
    }
}

async function createRandomUsers(n, start_on, min_eos, max_eos) {
    console.log('creating random users', n, start_on);
    const list = [];
    for (let i = start_on; i < start_on + n; i++) {
        const nbps = Math.ceil(Math.random() * 30);
        const type = Math.random() > 0.33 ? 1 : 0;
        const isVoting = Math.random() < 0.6;
        const obj = {
            user_id: (i + 1).toString(),
            eos_balance: ((Math.random() * (max_eos - min_eos)) + min_eos),
            proxy: '',
            producers: []
        };
        if (isVoting) {
            obj.proxy = type === 0 ? _.sample(proxy_list) : '';
            obj.producers = type === 1 ? _.sampleSize(producer_list, nbps) : [];
        }
        console.log(obj.eos_balance);
        list.push(obj);
    }
    for (const user of list) {
        await new User(user).save();
    }
    return true;
}

const init = async () => {
    console.log('loading producers...');
    const producers = await rpc.get_producers(true, null, 100);
    for (const prod of producers.rows) {
        producer_list.push(prod.owner);
    }

    console.log('loading proxies...');
    const proxies = await rpc.get_table_rows({
        json: true,
        code: 'regproxyinfo',
        scope: 'regproxyinfo',
        table: 'proxies',
        limit: 400
    });
    for (const proxy of proxies.rows) {
        proxy_list.push(proxy.owner);
    }

    await createRandomUsers(200, 0, 1000, 10000);
    await createRandomUsers(100, 200, 10000, 100000);
    await createRandomUsers(50, 300, 100000, 1000000);
    await createRandomUsers(10, 350, 1000000, 10000000);
};

let total_eos = 0;
let voted_eos = 0;
const voters = [];
const producers_map = new Map();

const runTally = async () => {
    const cursor = User.find({}).cursor();
    cursor.on('data', function (doc) {
        total_eos += doc.eos_balance;
        if (doc.proxy !== '' || doc.producers.length > 0) {
            voted_eos += doc.eos_balance;
            voters.push(doc);
        }
    });
    cursor.on('end', async function () {
        console.log('Done!');
        console.log('Total EOS on Exchange: ' + total_eos);
        for (const voter of voters) {
            if (voter.proxy !== '') {
                voter.producers = await getProxyBPs(voter.proxy);
            }
            if (voter.producers.length > 0) {
                for (const prod of voter.producers) {
                    if (!producers_map.has(prod)) {
                        producers_map.set(prod, {
                            balance: voter.eos_balance,
                            share: (voter.eos_balance / voted_eos) * 100
                        });
                    } else {
                        const current_vote_share = producers_map.get(prod).balance;
                        producers_map.set(prod, {
                            balance: (voter.eos_balance + current_vote_share),
                            share: ((voter.eos_balance + current_vote_share) / voted_eos) * 100
                        });
                    }
                }
            }
        }
        const prod_array = [];
        producers_map.forEach((v, k) => {
            const _item = v;
            _item.producer = k;
            prod_array.push(_item);
        });
        prod_array.sort((a, b) => {
            return b.share - a.share;
        });
        for (const prod of prod_array) {
            console.log('-----');
            console.log(`${prod.producer} has ${prod.balance.toFixed(2)} EOS - ${prod.share.toFixed(2)}% vote share`);
            // Loop coldwallets to assign
            const _target = prod.balance;
            let _votes = 0;
            for (const cw of cWallets) {
                if (cw.prods.length < 30 && _votes < _target && prod.balance > cw.balance) {
                    prod.balance -= cw.balance;
                    _votes += cw.balance;
                    cw.prods.push(prod.producer);
                }
            }
            const _missing = ((_target - _votes) / _target * 100);
            console.log(`${prod.producer} got ${_votes.toFixed(4)} voted EOS (missing ${_missing.toFixed(2)}%)`);
        }
        // console.log(cWallets);
        for (const cw of cWallets) {
            console.log(`${cw.account} will vote for ${cw.prods.length} with ${cw.balance} EOS`);
        }
    });
};

fastify.route({
    method: "GET",
    url: '/api/initrandom',
    handler: async (request, reply) => {
        await init();
        return {status: "OK"}
    }
});

fastify.route({
    method: "GET",
    url: '/api/process',
    handler: async (request, reply) => {
        await runTally();
        voteManager.executeVotes(false).catch(console.log);
        reply.send({status: "OK"});
    }
});

// Run the server!
fastify.listen(3000, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
});
