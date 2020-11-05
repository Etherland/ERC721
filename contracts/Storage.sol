pragma solidity 0.6.2;

contract Storage {
    /* ERC165.sol */
    bytes4 internal constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;
    /**
    * @dev a mapping of interface id to whether or not it's supported
    */
    mapping(bytes4 => bool) internal _supportedInterfaces;
    /**/ 

    /* ERC721.sol */
    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 internal constant _ERC721_RECEIVED = 0x150b7a02;

    // Mapping from token ID to owner
    mapping (uint256 => address) internal _tokenOwner;

    // Mapping from token ID to approved address
    mapping (uint256 => address) internal _tokenApprovals;

    // Mapping from owner to number of owned token
    mapping (address => Counters.Counter) internal _ownedTokensCount;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) internal _operatorApprovals;

    bytes4 internal constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    /**/

    /* ERC721Full.sol */
    // Token name
    string internal _name;

    // Token symbol
    string internal _symbol;

    // Optional mapping for token URIs
    mapping(uint256 => string) internal _tokenURIs;

    // Mapping from owner to list of owned token IDs
    mapping(address => uint256[]) internal _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) internal _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] internal _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) internal _allTokensIndex;

    bytes4 internal constant _INTERFACE_ID_ERC721_ENUMERABLE = 0x780e9d63;
    /*
    * 0x780e9d63 ===
    *     bytes4(keccak256('totalSupply()')) ^
    *     bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
    *     bytes4(keccak256('tokenByIndex(uint256)'))
    */

    bytes4 internal constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;
    /*
    * 0x5b5e139f ===
    *     bytes4(keccak256('name()')) ^
    *     bytes4(keccak256('symbol()')) ^
    *     bytes4(keccak256('tokenURI(uint256)'))
    */
    /**/

    /* Ownable.sol */
    address internal _owner;
    /**/

    /* Administrable.sol */
    /**
    * @dev ADMINS STORAGE 
    * @dev rights are integer(int16) defined as follow :
    *       1 : address can only mint tokens 
    *       2 : address can mint AND burn tokens
    */
    mapping(address => int16) internal admins;
    /**/

    /* TradeableERC721Token.sol */
    address public proxyRegistryAddress;
    uint256 internal _currentTokenId = 0;
    /**/

    /* TokenMetadatas.sol */
    // Mapping from token ID to token metadatas
    mapping(uint256 => string) internal _tokensMetadatas;
    /**/

    /* Etherland.sol */
    string internal _baseTokenURI;
    /**/
}