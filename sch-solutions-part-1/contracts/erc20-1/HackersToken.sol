// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HackersToken is ERC20 {
    address public owner;

    constructor() ERC20("Hackers Token", "HTK") {
        owner = msg.sender;
    }

    function mint(address _to, uint _amount) external {
        require(msg.sender == owner, "Not owner");
        _mint(_to, _amount);
    }
}
