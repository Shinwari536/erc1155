// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";


contract GameItems_ is ERC1155 {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant BRONZE = 2;
    uint256 public constant THORS_HAMMER = 3;
    uint256 public constant SWORD = 4;
    uint256 public constant SHIELD = 5;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, GOLD, 10**18, "");
        _mint(msg.sender, SILVER, 10**27, "");
        _mint(msg.sender, BRONZE, 10**27, "");
        _mint(msg.sender, THORS_HAMMER, 10, "");
        _mint(msg.sender, SWORD, 10, "");
        _mint(msg.sender, SHIELD, 1000, "");
    }

/*
******** Note: You provide a single URI for all of your NFT tokens.********

1. first go to https://car.ipfs.io/
2. upload multiple files.
3. Download the .json file (metadata) for all the files.
4. Now go to https://nft.storage/
5. upload the newly downloaed .json file.
6. You will get the URI of the uploaded .json file to nft.storage.
7. Use that URI in your ERC1155 contract as URI for your NFTs.

*/
    function uri(uint256 _tokenId) public view virtual override returns (string memory) {
        return string(
            abi.encodePacked("https://game.example/api/item/", Strings.toString(_tokenId), ".json")
        );
    }
}