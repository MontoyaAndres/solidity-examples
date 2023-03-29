// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract OpenOcean {
    uint256 public constant MAX_PRICE = 100 ether;

    struct Item {
        uint256 itemId;
        address collection;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool isSold;
    }

    uint256 public itemsCounter;
    mapping(uint256 => Item) public listedItems;

    constructor() {}

    // List item function
    // 1. Make sure params are correct
    // 2. Increment itemsCounter
    // 3. Transfer token from sender to the contract
    // 4. Add item to listedItems mapping
    function listItem(
        address _collection,
        uint256 _tokenId,
        uint256 _price
    ) external {
        require(_price != 0 && _price <= MAX_PRICE, "Wrong price");

        itemsCounter += 1;

        IERC721(_collection).transferFrom(msg.sender, address(this), _tokenId);

        listedItems[itemsCounter] = Item(
            itemsCounter,
            _collection,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
    }

    // Purchase item function
    // 1. Check that item exists and not sold
    // 2. Check that enough ETH was paid
    // 3. Change item status to "sold"
    // 4. Transfer NFT to buyer
    // 5. Transfer ETH to seller
    function purchase(uint _itemId) external payable {
        require(_itemId != 0 && _itemId <= itemsCounter, "incorrect _itemId");

        Item storage item = listedItems[_itemId];
        require(!item.isSold, "item is already sold");
        require(msg.value == item.price, "wrong ETH was sent");

        item.isSold = true;

        IERC721(item.collection).transferFrom(
            address(this),
            msg.sender,
            item.tokenId
        );

        (bool sent, bytes memory data) = item.seller.call{value: msg.value}("");
        require(sent, "Failed to transfer ETH");
    }
}
