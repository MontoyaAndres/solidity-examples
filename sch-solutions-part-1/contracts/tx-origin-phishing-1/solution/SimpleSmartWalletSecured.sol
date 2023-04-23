// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "hardhat/console.sol";

contract SimpleSmartWalletSecured {
    address public walletOwner;

    constructor() payable {
        walletOwner = msg.sender;
    }

    function transfer(address payable _to, uint _amount) public {
        console.log(msg.sender, walletOwner, _to);

        require(msg.sender == walletOwner, "Only owner");

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed");
    }
}
