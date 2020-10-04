require('chai').use(require('chai-as-promised')).should();
const EVMRevert = require('./helpers/VMExceptionRevert');

const FieldCoin = artifacts.require('../contracts/FieldCoin.sol');
const ProxyRegistry = artifacts.require('../contracts/ProxyRegistry.sol');

contract('FieldCoin', (accounts) => {
  let fieldCoin;
  let proxyRegistry;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const tokenName = 'TestToken';
  const tokenSymbol = 'TST';
  const baseURI = 'URI';

  beforeEach(async () => {
    proxyRegistry = await ProxyRegistry.new({ from: owner });
    fieldCoin = await FieldCoin.new(tokenName, tokenSymbol, proxyRegistry.address, baseURI, { from: owner });
  });

  it('checks if contract implements interfaces right', async () => {
    const erc165 = '0x01ffc9a7';
    const erc721 = '0x80ac58cd';
    const erc721enumerable = '0x780e9d63';
    const erc721metadata = '0x5b5e139f';
    const wrongInterface = '0x5b5e139d';
    (await fieldCoin.supportsInterface(erc165)).toString().should.equal('true');
    (await fieldCoin.supportsInterface(erc721)).toString().should.equal('true');
    (await fieldCoin.supportsInterface(erc721enumerable)).toString().should.equal('true');
    (await fieldCoin.supportsInterface(erc721metadata)).toString().should.equal('true');
    (await fieldCoin.supportsInterface(wrongInterface)).toString().should.equal('false');
  });

  it('checks token details (name, symbol)', async () => {
    (await fieldCoin.name()).toString().should.equal('TestToken');
    (await fieldCoin.symbol()).toString().should.equal('TST');
  });

  it('test mint and batch mint functions', async () => {
    await fieldCoin.mintTo(user1, { from: user1 }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.mintTo(user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('1');
    await fieldCoin.batchMintTo(5, user1, { from: user1 }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('6');
  });

  it('test ownership of the contract', async () => {
    (await fieldCoin.owner()).should.equal(owner);
    (await fieldCoin.isOwner({ from: owner })).toString().should.equal('true');
    await fieldCoin.transferOwnership(user1, { from: user1 }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.transferOwnership(user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.isOwner({ from: owner })).toString().should.equal('false');
    (await fieldCoin.isOwner({ from: user1 })).toString().should.equal('true');
    await fieldCoin.renounceOwnership({ from: owner }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.renounceOwnership({ from: user1 }).should.be.fulfilled;
    (await fieldCoin.isOwner({ from: owner })).toString().should.equal('false');
    (await fieldCoin.isOwner({ from: user1 })).toString().should.equal('false');
  });

  it('test token base uri functions', async () => {
    const uri2 = 'URI2';
    (await fieldCoin.baseTokenURI()).toString().should.equal('URI');
    await fieldCoin.setBaseTokenURI(uri2, { from: user1 }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.setBaseTokenURI(uri2, { from: owner }).should.be.fulfilled;
    (await fieldCoin.baseTokenURI()).toString().should.equal('URI2');
  });

  it('checks OpenSea version', async () => {
    (await fieldCoin.openSeaVersion()).toString().should.equal('1.2.0');
  });

  it('test burn function', async () => {
    await fieldCoin.mintTo(user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('1');
    await fieldCoin.burn(1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('0');
  });

  it('retrieve token uri', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    (await fieldCoin.tokenURI(1)).toString().should.equal('URI1');
    (await fieldCoin.tokenURI(2)).toString().should.equal('URI2');
    (await fieldCoin.tokenURI(3)).toString().should.equal('URI3');
    (await fieldCoin.tokenURI(4)).toString().should.equal('URI4');
    (await fieldCoin.tokenURI(5)).toString().should.equal('URI5');
  });

  it('return token id by index for an investor holding several tokens', async () => {
    await fieldCoin.mintTo(user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('1');
    await fieldCoin.batchMintTo(5, user2, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user2)).toString().should.equal('5');
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('6');
    (await fieldCoin.tokenOfOwnerByIndex(user1, 0)).toString().should.equal('1');
    (await fieldCoin.tokenOfOwnerByIndex(user2, 0)).toString().should.equal('2');
    (await fieldCoin.tokenOfOwnerByIndex(user2, 1)).toString().should.equal('3');
    (await fieldCoin.tokenOfOwnerByIndex(user2, 2)).toString().should.equal('4');
    (await fieldCoin.tokenOfOwnerByIndex(user2, 3)).toString().should.equal('5');
    (await fieldCoin.tokenOfOwnerByIndex(user2, 4)).toString().should.equal('6');
    await fieldCoin.tokenOfOwnerByIndex(user2, 5).should.be.rejectedWith(EVMRevert);
    (await fieldCoin.tokenOfOwnerByIndex(user1, 1)).toString().should.equal('7');
    (await fieldCoin.tokenOfOwnerByIndex(user1, 2)).toString().should.equal('8');
    (await fieldCoin.tokenOfOwnerByIndex(user1, 3)).toString().should.equal('9');
    (await fieldCoin.tokenOfOwnerByIndex(user1, 4)).toString().should.equal('10');
    (await fieldCoin.tokenOfOwnerByIndex(user1, 5)).toString().should.equal('11');
    await fieldCoin.tokenOfOwnerByIndex(user1, 6).should.be.rejectedWith(EVMRevert);
  });

  it('return total supply', async () => {
    (await fieldCoin.totalSupply()).toString().should.equal('0');
    await fieldCoin.batchMintTo(5, user2, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user2)).toString().should.equal('5');
    (await fieldCoin.totalSupply()).toString().should.equal('5');
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    (await fieldCoin.totalSupply()).toString().should.equal('10');
    await fieldCoin.batchMintTo(5, user3, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user3)).toString().should.equal('5');
    (await fieldCoin.totalSupply()).toString().should.equal('15');
  });

  it('return token id by index on the smart contract', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    (await fieldCoin.tokenByIndex(0)).toString().should.equal('1');
    (await fieldCoin.tokenByIndex(1)).toString().should.equal('2');
    (await fieldCoin.tokenByIndex(2)).toString().should.equal('3');
    (await fieldCoin.tokenByIndex(3)).toString().should.equal('4');
    (await fieldCoin.tokenByIndex(4)).toString().should.equal('5');
    await fieldCoin.tokenByIndex(6).should.be.rejectedWith(EVMRevert);
  });

  it('returns all token ids of an investor', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    await fieldCoin.batchMintTo(5, user2, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user2)).toString().should.equal('5');
    await fieldCoin.batchMintTo(5, user3, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user3)).toString().should.equal('5');
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('10');
    (await fieldCoin.tokensOf(user1)).toString().should.equal('1,2,3,4,5,16,17,18,19,20');
    (await fieldCoin.tokensOf(user2)).toString().should.equal('6,7,8,9,10');
    (await fieldCoin.tokensOf(user3)).toString().should.equal('11,12,13,14,15');
  });

  it('returns owner of a token id', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    await fieldCoin.batchMintTo(5, user2, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user2)).toString().should.equal('5');
    await fieldCoin.batchMintTo(5, user3, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user3)).toString().should.equal('5');
    (await fieldCoin.ownerOf(1)).should.equal(user1);
    (await fieldCoin.ownerOf(2)).should.equal(user1);
    (await fieldCoin.ownerOf(3)).should.equal(user1);
    (await fieldCoin.ownerOf(4)).should.equal(user1);
    (await fieldCoin.ownerOf(5)).should.equal(user1);
    (await fieldCoin.ownerOf(6)).should.equal(user2);
    (await fieldCoin.ownerOf(7)).should.equal(user2);
    (await fieldCoin.ownerOf(8)).should.equal(user2);
    (await fieldCoin.ownerOf(9)).should.equal(user2);
    (await fieldCoin.ownerOf(10)).should.equal(user2);
    (await fieldCoin.ownerOf(11)).should.equal(user3);
    (await fieldCoin.ownerOf(12)).should.equal(user3);
    (await fieldCoin.ownerOf(13)).should.equal(user3);
    (await fieldCoin.ownerOf(14)).should.equal(user3);
    (await fieldCoin.ownerOf(15)).should.equal(user3);
    await fieldCoin.ownerOf(16).should.be.rejectedWith(EVMRevert);
  });

  it('testing approve function', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    await fieldCoin.approve(user1, 1, { from: user1 }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.approve(user2, 1, { from: user3 }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.approve(user2, 1, { from: user1 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 7, { from: user1 }).should.be.rejectedWith(EVMRevert);
    (await fieldCoin.getApproved(1)).should.equal(user2);
  });

  it('testing approval for all function', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    await fieldCoin.setApprovalForAll(user1, true, { from: user1 }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.setApprovalForAll(user2, true, { from: user1 }).should.be.fulfilled;
    (await fieldCoin.isApprovedForAll(user1, user2)).toString().should.equal('true');
    await fieldCoin.approve(user2, 1, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 2, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 3, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 4, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 5, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 7, { from: user2 }).should.be.rejectedWith(EVMRevert);
    (await fieldCoin.getApproved(1)).should.equal(user2);
    (await fieldCoin.getApproved(2)).should.equal(user2);
    (await fieldCoin.getApproved(3)).should.equal(user2);
    (await fieldCoin.getApproved(4)).should.equal(user2);
    (await fieldCoin.getApproved(5)).should.equal(user2);
  });

  it('testing transferFrom function', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    await fieldCoin.setApprovalForAll(user2, true, { from: user1 }).should.be.fulfilled;
    (await fieldCoin.isApprovedForAll(user1, user2)).toString().should.equal('true');
    await fieldCoin.approve(user2, 1, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 2, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 3, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 4, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 5, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 7, { from: user2 }).should.be.rejectedWith(EVMRevert);
    (await fieldCoin.getApproved(1)).should.equal(user2);
    (await fieldCoin.getApproved(2)).should.equal(user2);
    (await fieldCoin.getApproved(3)).should.equal(user2);
    (await fieldCoin.getApproved(4)).should.equal(user2);
    (await fieldCoin.getApproved(5)).should.equal(user2);
    (await fieldCoin.ownerOf(1)).should.equal(user1);
    (await fieldCoin.ownerOf(2)).should.equal(user1);
    (await fieldCoin.ownerOf(3)).should.equal(user1);
    (await fieldCoin.ownerOf(4)).should.equal(user1);
    (await fieldCoin.ownerOf(5)).should.equal(user1);
    await fieldCoin.transferFrom(user1, user3, 1, { from: user2 }).should.be.fulfilled;
    await fieldCoin.transferFrom(user1, user3, 2, { from: user2 }).should.be.fulfilled;
    await fieldCoin.transferFrom(user1, user3, 3, { from: user2 }).should.be.fulfilled;
    await fieldCoin.transferFrom(user1, user2, 4, { from: user2 }).should.be.fulfilled;
    await fieldCoin.transferFrom(user1, user2, 5, { from: user2 }).should.be.fulfilled;
    await fieldCoin.transferFrom(user3, user1, 1, { from: user2 }).should.be.rejectedWith(EVMRevert);
    (await fieldCoin.ownerOf(1)).should.equal(user3);
    (await fieldCoin.ownerOf(2)).should.equal(user3);
    (await fieldCoin.ownerOf(3)).should.equal(user3);
    (await fieldCoin.ownerOf(4)).should.equal(user2);
    (await fieldCoin.ownerOf(5)).should.equal(user2);
    (await fieldCoin.balanceOf(user1)).toString().should.equal('0');
    (await fieldCoin.balanceOf(user2)).toString().should.equal('2');
    (await fieldCoin.balanceOf(user3)).toString().should.equal('3');
  });

  it('testing safeTransferFrom function', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    await fieldCoin.setApprovalForAll(user2, true, { from: user1 }).should.be.fulfilled;
    (await fieldCoin.isApprovedForAll(user1, user2)).toString().should.equal('true');
    await fieldCoin.approve(user2, 1, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 2, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 3, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 4, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 5, { from: user2 }).should.be.fulfilled;
    await fieldCoin.approve(user2, 7, { from: user2 }).should.be.rejectedWith(EVMRevert);
    (await fieldCoin.getApproved(1)).should.equal(user2);
    (await fieldCoin.getApproved(2)).should.equal(user2);
    (await fieldCoin.getApproved(3)).should.equal(user2);
    (await fieldCoin.getApproved(4)).should.equal(user2);
    (await fieldCoin.getApproved(5)).should.equal(user2);
    (await fieldCoin.ownerOf(1)).should.equal(user1);
    (await fieldCoin.ownerOf(2)).should.equal(user1);
    (await fieldCoin.ownerOf(3)).should.equal(user1);
    (await fieldCoin.ownerOf(4)).should.equal(user1);
    (await fieldCoin.ownerOf(5)).should.equal(user1);
    await fieldCoin.safeTransferFrom(user1, user3, 1, { from: user2 }).should.be.fulfilled;
    await fieldCoin.safeTransferFrom(user1, user3, 2, { from: user2 }).should.be.fulfilled;
    await fieldCoin.safeTransferFrom(user1, user3, 3, { from: user2 }).should.be.fulfilled;
    await fieldCoin.safeTransferFrom(user1, user2, 4, { from: user2 }).should.be.fulfilled;
    await fieldCoin.safeTransferFrom(user1, user2, 5, { from: user2 }).should.be.fulfilled;
    await fieldCoin.safeTransferFrom(user3, user1, 1, { from: user2 }).should.be.rejectedWith(EVMRevert);
    (await fieldCoin.ownerOf(1)).should.equal(user3);
    (await fieldCoin.ownerOf(2)).should.equal(user3);
    (await fieldCoin.ownerOf(3)).should.equal(user3);
    (await fieldCoin.ownerOf(4)).should.equal(user2);
    (await fieldCoin.ownerOf(5)).should.equal(user2);
    (await fieldCoin.balanceOf(user1)).toString().should.equal('0');
    (await fieldCoin.balanceOf(user2)).toString().should.equal('2');
    (await fieldCoin.balanceOf(user3)).toString().should.equal('3');
  });

  it('setting Token Metadatas on token', async () => {
    await fieldCoin.batchMintTo(5, user1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.balanceOf(user1)).toString().should.equal('5');
    await fieldCoin.setMetadatas(1, 'dataOfToken1', { from: user1 }).should.be.rejectedWith(EVMRevert);
    await fieldCoin.setMetadatas(1, 'dataOfToken1', { from: owner }).should.be.fulfilled;
    (await fieldCoin.getMetadatas(1)).toString().should.equal('dataOfToken1');
    await fieldCoin.removeMetadatas(1, { from: owner }).should.be.fulfilled;
    (await fieldCoin.getMetadatas(1)).toString().should.equal('');
  });
});
