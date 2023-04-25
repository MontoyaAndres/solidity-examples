// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract EtherBank {
    mapping(address => uint256) public balances;

    function depositETH() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawETH() public {
        uint256 balance = balances[msg.sender];

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdraw failed");

        // Update balance
        balances[msg.sender] = 0;
    }
}
