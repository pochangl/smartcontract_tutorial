const assert = require('assert');
const ganache = require('ganache-cli');
const { exit } = require('process');

const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compile = require('../compile');
const Inbox = compile('Inbox.sol').Inbox;

const bytecode = Inbox.evm.bytecode.object;
const interface = Inbox.abi;

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(interface).deploy({
        data: bytecode,
        arguments: ['initial']
    }).send({ from: accounts[0], gas: '1000000' });

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'initial');
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('second').send({ from: accounts[0], });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'second');
    });
});