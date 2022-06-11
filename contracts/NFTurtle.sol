// SPDX-License-Identifier: MIT.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFT ERC-721. (for research porpose).
/// @author Esteban H. Somma.
/// @notice First works by artists who don't yet know they are artists... but they will be.
/// @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible
///  Token Standard, including the Metadata, Enumerable and Ownable extensions,
///  and include a mint function to mint from a list of IPFS hashes (CIDs) that
///  link to the json metadata.
contract NFTurtle is ERC721Enumerable, Ownable {
    //#region Declarations

    // Store the base URL for the URI of the tokens that link to the json metadata.
    string public baseURI;

    // List of the IPFSs hashes (CID) of the json metadata asociated to the tokenId.
    mapping(uint256 => string) private _hashIPFS;

    // List of IPFS hash used to mint to avoid minting with duplicated json metadata cid.
    mapping(string => bool) private _hashesIPFSMinted;

    //#endregion

    //#region Constructor

    /// @dev Initializes the contract by setting a `name`, `symbol` and the base
    ///  URI to the token collection.
    /// @param name The name of the token collection.
    /// @param symbol The symbol of the token collection.
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        baseURI = "https://ipfs.io/ipfs/";
    }

    //#endregion

    //#region Functions

    /// @notice Mints the specified list of `hashes` on behalf of `to`.
    /// @param to The first owner.
    /// @param hashes The list of IPFS hashes (CIDs) that link to the json metadata.
    ///
    /// Requirements:
    /// - `sender` Must be the owner of the contract.
    /// - `hashes[n]` Must not have been previously used.
    function mint(address to, string[] memory hashes) external onlyOwner {
        uint256 supply = totalSupply();

        for (uint256 i = 0; i < hashes.length; i++) {
            require(!_hashesIPFSMinted[hashes[i]], "IPFS hash already used");

            _safeMint(to, supply + i);
            _hashIPFS[supply + i] = hashes[i];
            _hashesIPFSMinted[hashes[i]] = true;
        }
    }

    /// @notice Returns the tokenIds of the `owner_`.
    /// @param owner_ The address you want to query.
    /// @return The list of tokenIds of the owner.
    function walletOfOwner(address owner_)
        external
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(owner_);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);

        for (uint256 i = 0; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner_, i);
        }
        return tokenIds;
    }

    /// @dev Returns the Uniform Resource Identifier (URI) for the `tokenId` with
    ///  the IPFS hash of the json metadata.
    /// @param tokenId The tokenId of which you want tokenURI.
    /// @return The Uniform Resource Identifier (URI) for `tokenId` token.
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "TokenId not found");

        string memory currentBaseURI = _baseURI();
        return
            (bytes(currentBaseURI).length > 0 &&
                bytes(_hashIPFS[tokenId]).length > 0)
                ? string(abi.encodePacked(currentBaseURI, _hashIPFS[tokenId]))
                : "";
    }

    /// @dev Changes the actual {baseURI} to the `newBaseURI`.
    /// @param newBaseURI The new base URI.
    ///
    /// Requirements:
    /// - `sender` Must be the owner of the contract.
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    /// @dev Base URI for computing {tokenURI}. The resulting URI for each token
    ///  will be the concatenation of the `baseURI` and the `tokenId`.
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    //#endregion
}
