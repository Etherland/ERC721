// SPDX-License-Identifier: UNLICENSED
/**
 * @dev Credits to
 * Mathieu Lecoq
 * september 3rd 2020 
 *
 * @dev Property
 * all rights are reserved to EtherLand ltd
 *
 * @dev deployed with compiler version 0.6.2
 */
pragma solidity 0.6.2;

import "./TradeableERC721Token.sol";
import "./TokensMetadatas.sol";

/**
* @title Etherland NFT Assets
*/
contract Etherland is TradeableERC721Token, TokensMetadatas {
    string private _baseTokenURI;

    constructor(
        string memory _name,
        string memory _symbol,
        address _proxyRegistryAddress,
        string memory baseURI,
        address _owner
    ) public TradeableERC721Token(_name, _symbol, _proxyRegistryAddress) {
        _baseTokenURI = baseURI;
        _transferOwnership(_owner);
    }

    function baseTokenURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseTokenURI(string memory uri) public onlyOwner {
        _baseTokenURI = uri;
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return Strings.strConcat(
            baseTokenURI(),
            Strings.uint2str(_tokenId)
        );
    }

}
