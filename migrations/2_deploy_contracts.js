const Etherland = artifacts.require('./Etherland.sol');
const Proxy = artifacts.require('./ERC1822/Proxy.sol');
const Web3 = require('web3');

const web3 = new Web3(Web3.givenProvider);

const proxies = {
  'rinkeby-fork': '0xf57b2c51ded3a29e6891aba85459d600256cf317',
  rinkeby: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
  live: '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
};
const DEPLOY_ETHERLAND_ERC721 = true;
const NAME = 'Etherland';
const SYMBOL = 'ELAND';
const BASE_TOKEN_URI = 'https://fieldcoin-nft.herokuapp.com/api/token/';
/* Etherland CEO */
const owner = '0x21fAC178E0b0df2Db51A06d52B32DE4479a8b3F1';

let deployed = false;

/**
 * @dev Contract Deployer
 * @notice run the `truffle deploy` command
 * @see readme
 */
// module.exports = async (deployer, network) => {
//   // OpenSea proxy registry addresses for rinkeby and mainnet.
//   const openSeaProxy = proxies[network];
//   if (DEPLOY_ETHERLAND_ERC721 && openSeaProxy) {
//     await deployer.deploy(Etherland, NAME, SYMBOL, openSeaProxy, BASE_TOKEN_URI, owner, { gas: 2800000 });
//   } else console.error('please set variable DEPLOY_ETHERLAND_ERC721 to true before deploying (see /migrations/2_deploy_contracts)');
// };
module.exports = async (deployer, network) => {
  const openSeaProxy = proxies[network];

  if (DEPLOY_ETHERLAND_ERC721 && openSeaProxy) {
    if (!deployed) {
      // deploy Logic Code
      await deployer.deploy(Etherland, { gas: 2800000 });
      const { abi, address } = Etherland;
      console.log('Etherland address', address);
      const logic = new web3.eth.Contract(abi, address, { address });
      const constructData = logic.methods.init(NAME, SYMBOL, openSeaProxy, BASE_TOKEN_URI, owner).encodeABI();
      await deployer.deploy(Proxy, constructData, address);
      console.log('Proxy address', Proxy.address);
      deployed = true;
    }
  } else console.error('Etherland contract is not ready for deployment, please check your settings at 2_deploy_contracts.js');
};
