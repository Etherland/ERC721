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
import "./ERC1822/Proxiable.sol";

/**
* @title Etherland NFT Assets
*/
contract Etherland is TradeableERC721Token, TokensMetadatas, Proxiable {
    // string private _baseTokenURI;
    /**
    * @dev initialized state MUST remain set to false on Implementation Contract 
    */
    bool public initialized = false;

    /**
    * @dev event emitting when the `_baseTokenUri` is updated by owner
    */
    event BaseTokenUriUpdated(string newUri);

    /**
    * @dev Logic code implementation contact constructor
    * @dev MUST be called by deployer only if contract has not been initialized before
    */
    function intializer(
        string memory _name,
        string memory _symbol,
        address _proxyRegistryAddress,
        string memory baseURI,
        address _owner
    ) public TradeableERC721Token(_name, _symbol, _proxyRegistryAddress) {
        // logic code contract can be initialized only once
        if (initialized != true) {
            // MUST set Proxy contract state
            initialized = true;

            _baseTokenURI = baseURI;
            _transferOwnership(_owner);
        }
    }

    /**
    * @dev Retrieve all NFTs base token uri 
    */
    function baseTokenURI() public view returns (string memory) {
        return _baseTokenURI;
    }

    /**
    * @dev Set the base token uri for all NFTs
    */
    function setBaseTokenURI(string memory uri) public onlyOwner {
        _baseTokenURI = uri;
        emit BaseTokenUriUpdated(uri);
    }

    /**
    * @dev Retrieve the uri of a specific token 
    * @param _tokenId the id of the token to retrieve the uri of
    * @return computed uri string pointing to a specific _tokenId
    */
    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return Strings.strConcat(
            baseTokenURI(),
            Strings.uint2str(_tokenId)
        );
    }

    /**
    * @dev EIP-1822 feature
    * @dev Realize an update of the Etherland logic code 
    * @dev calls the proxy contract to update stored logic code contract address at keccak256("PROXIABLE")
    */
    function updateCode(address newCode) public onlyOwner {
        updateCodeAddress(newCode);
    }

}
