const Etherland = artifacts.require('./Etherland.sol');
const proxies = {
  rinkeby: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
  'rinkeby-fork': '0xf57b2c51ded3a29e6891aba85459d600256cf317',
  live: '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
};
const DEPLOY_ETHERLAND_ERC721 = true;
const NAME = 'Etherland';
const SYMBOL = 'ELAND';
const BASE_TOKEN_URI = 'https://fieldcoin-nft.herokuapp.com/api/token/';
/* Etherland CEO */
const owner = '0x7640AbEb029a856D3104dF93f13536E20Cb00d7c';

/**
 * @dev Contract Deployer
 * @notice run the `truffle deploy` command
 * @see readme
 */
module.exports = async (deployer, network) => {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  const openSeaProxy = await Promise.resolve(proxies[network]);
  if (DEPLOY_ETHERLAND_ERC721) {
    await deployer.deploy(Etherland, NAME, SYMBOL, openSeaProxy, BASE_TOKEN_URI, owner, { gas: 2800000 });
  } else console.error('please set variable DEPLOY_ETHERLAND_ERC721 to true before deploying (see /migrations/2_deploy_contracts)');
};
