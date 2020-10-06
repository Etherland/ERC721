// SPDX-License-Identifier: UNLICENSED
/**
 * @dev Credits to
 * Mathieu L. @ ProApps 
 * https://proapps.fr
 * september 3rd 2020 
 *
 * @dev Property
 * all rights are reserved to EtherLand SAS / Fieldcoin
 *
 * @dev deployed with compiler version x.x.x
 */
pragma solidity 0.6.2;

import "./TradeableERC721Token.sol";
import "./TokensMetadatas.sol";

/**
* @title Fieldcoin NFT Assets
*/
contract FieldCoin is TradeableERC721Token, TokensMetadatas {
    string private _baseTokenURI;


    constructor(
        string memory _name,
        string memory _symbol,
        address _proxyRegistryAddress,
        string memory baseURI
    ) public TradeableERC721Token(_name, _symbol, _proxyRegistryAddress) {
        _baseTokenURI = baseURI;
    }

    function openSeaVersion() public pure returns (string memory) {
        return "1.2.0";
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
