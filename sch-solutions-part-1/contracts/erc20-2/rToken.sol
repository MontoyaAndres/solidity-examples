// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract rToken is ERC20 {
    address public owner;
    address public underlyingToken;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(
        address _underlyingToken,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        require(_underlyingToken != address(0), "wrong underlying");
        owner = msg.sender;
        underlyingToken = _underlyingToken;
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function burn(address _to, uint256 _amount) external onlyOwner {
        _burn(_to, _amount);
    }
}
