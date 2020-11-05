// withadmins VERSION
const HDWalletProvider = require('@truffle/hdwallet-provider');

const MNEMONIC = 'faculty receive force iron tribe pretty wrap legend sea shop divide name';
const INFURA_KEY = '3537ff82002e4b93bf5f0ec26800f7bd';

const solcStable = {
  version: '0.6.2',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

const needsInfura = process.env.npm_config_argv && (process.env.npm_config_argv.includes('rinkeby') || process.env.npm_config_argv.includes('live'));

if (needsInfura && !(MNEMONIC && INFURA_KEY)) {
  console.error('Please set a mnemonic and infura key.');
  process.exit(0);
}

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    coverage: {
      host: 'localhost',
      network_id: '*', // eslint-disable-line camelcase
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${INFURA_KEY}`);
      },
      network_id: '*',
      networkCheckTimeout: 10000000,
    },
    live: {
      network_id: 1,
      provider: () => {
        return new HDWalletProvider(MNEMONIC, `https://mainnet.infura.io/v3/${INFURA_KEY}`);
      },
      gas: 4000000,
      gasPrice: 5000000000,
    },
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      outputFile: './gas-report',
    },
  },
  plugins: ['solidity-coverage'],
  compilers: {
    solc: solcStable,
  },
};
