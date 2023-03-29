// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyAwesomeArt is ERC721 {
    uint16 public immutable MAX_SUPPLY = 10000;
    uint256 public immutable MINT_PRICE = 0.1 ether;

    uint16 public currentSupply = 0;

    constructor() ERC721("My Awesome ART", "AWESOME") {}

    function mint() external payable returns (uint16) {
        require(msg.value == MINT_PRICE, "mint costs 0.1 eth");
        require(currentSupply < MAX_SUPPLY, "max supply reached");

        currentSupply += 1;

        _mint(msg.sender, currentSupply);

        return currentSupply;
    }
}
