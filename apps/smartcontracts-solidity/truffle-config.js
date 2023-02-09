require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { INFURA_API_KEY, MNEMONIC } = process.env;

module.exports = {
  plugins: ['truffle-plugin-verify'],
  compilers: {
    solc: {
      version: "^0.8.17"
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    matic: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    }
  }
};