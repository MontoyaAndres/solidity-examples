// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "hardhat/console.sol";

contract SimpleSmartWallet {
    address public walletOwner;

    constructor() payable {
        walletOwner = msg.sender;
    }

    function transfer(address payable _to, uint _amount) public {
        console.log(tx.origin, walletOwner, _to);

        require(tx.origin == walletOwner, "Only owner");

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed");
    }
}
