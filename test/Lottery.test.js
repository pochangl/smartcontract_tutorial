const assert = require('assert');
const ganache = require('ganache-cli');
const { exit } = require('process');

const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compile = require('../compile');

const Lottery = compile('Lottery.sol').Lottery;

const bytecode = Lottery.evm.bytecode.object;
const interface = Lottery.abi;

const minimum = 10000000000000000;

let accounts;
let lottery;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(interface).deploy({
        data: bytecode,
    }).send({ from: accounts[0], gas: '1000000' });

});

describe('Lottery', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('has a correct manager', async () => {
        const manager = await lottery.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it('test full game', async () => {
        let players = await lottery.methods.getPlayers().call();
        assert.deepEqual(players, []);

        let balance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(balance, 0);

        // player 1 join
        await lottery.methods.enter().send({ from: accounts[1], value: minimum })
        players = await lottery.methods.getPlayers().call();

        balance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(balance, minimum);

        assert.deepEqual(players, [accounts[1]]);

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        // empty after lottery
        balance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(balance, 0);
        players = await lottery.methods.getPlayers().call();
        assert.deepEqual(players, []);
    });
});