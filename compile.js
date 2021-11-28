const path = require('path');
const fs = require('fs');
const solc = require('solc');

module.exports = function (fileName) {
    const inboxPath = path.resolve(__dirname, 'contracts', fileName);
    const source = fs.readFileSync(inboxPath, 'utf-8');

    var input = {
        language: 'Solidity',
        sources: {
            'target': {
                content: source
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    return JSON.parse(solc.compile(JSON.stringify(input))).contracts['target'];
}