pragma solidity 0.6.2;

import "./Ownable.sol";

/**
 * @title TokensMetadatas
 * @dev setMetadatas
 * @dev getMetadatas
 * @dev removeMetadatas
 */
contract TokensMetadatas is Ownable {
    // Mapping from token ID to token metadatas
    mapping(uint256 => string) private _tokensMetadatas;

    function setMetadatas(uint256 _tokenId, string memory _metadatas) public onlyOwner {
        _tokensMetadatas[_tokenId] = _metadatas;
    }

    function removeMetadatas(uint256 _tokenId) public onlyOwner {
        string memory emptyMetadatas = "";
        _tokensMetadatas[_tokenId] = emptyMetadatas;
    }

    function getMetadatas(uint256 _tokenId) public view returns (string memory) {
        return _tokensMetadatas[_tokenId];
    }
}