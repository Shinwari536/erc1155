// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract GameItems is ERC1155, Ownable {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant BRONZE = 2;
    uint256 public constant THORS_HAMMER = 3;
    uint256 public constant SWORD = 4;
    uint256 public constant SHIELD = 5;

/* 
*   Note: To have control over a single URI
*   Owner of the contract can set/change the URI of a token
*/
    mapping (uint256=>string) public _URIs;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, GOLD, 10**18, "");
        _mint(msg.sender, SILVER, 10**27, "");
        _mint(msg.sender, BRONZE, 10**27, "");
        _mint(msg.sender, THORS_HAMMER, 10, "");
        _mint(msg.sender, SWORD, 10, "");
        _mint(msg.sender, SHIELD, 1000, "");
    }

    function uri(uint256 _tokenId) public view virtual override returns (string memory) {
        return _URIs[_tokenId];
    }

    function setTokenURI(uint256 tokenId,string memory newuri) public onlyOwner{
        require(bytes(_URIs[tokenId]).length == 0, "Connot set URI twice");
        require(bytes(newuri).length > 0, "Connot set empty string");
        _URIs[tokenId] = newuri;
    }

    function mintTokens(uint256 _tokenId, uint256 _amount) public onlyOwner{
        _mint(msg.sender, _tokenId, _amount, "0x00");
    }

    function mintbatchTokens(uint256[] memory _tokenId, uint256[] memory _amount) public onlyOwner{
        _mintBatch(msg.sender, _tokenId, _amount, "0x00");
    }


}