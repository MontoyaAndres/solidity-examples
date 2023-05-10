// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract ToTheMoon is ERC20Pausable {
    address public owner;

    modifier onlyOwner() {
        msg.sender == owner;
        _;
    }

    constructor(uint256 _initialSupply) ERC20("To The Moon", "TTM") {
        owner = msg.sender;
        _mint(owner, _initialSupply);
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function pause(bool state) external onlyOwner {
        if (state) {
            Pausable._pause();
        } else {
            Pausable._unpause();
        }
    }
}
