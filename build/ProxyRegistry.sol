// File: contracts/OwnableDelegateProxy.sol

pragma solidity 0.6.2;

/**
* @title OwnableDelegateProxy
* @dev OpenSea compliant feature
*/
contract OwnableDelegateProxy { }

// File: contracts/ProxyRegistry.sol

pragma solidity 0.6.2;


/**
* @title ProxyRegistry
* @dev OpenSea compliant feature
*/
contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}
