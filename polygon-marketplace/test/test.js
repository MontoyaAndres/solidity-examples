describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    /* Deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();

    console.log("contract address", nftMarketplace.address);

    let listingPrice = await nftMarketplace.getListingPrice();
    listingPrice = listingPrice.toString();

    console.log("listingPrice", listingPrice);

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    console.log("auctionPrice", auctionPrice);

    /* craete two tokens */
    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com",
      auctionPrice,
      { value: listingPrice }
    );
    await nftMarketplace.createToken(
      "https://www.mytokenlocation2.com",
      auctionPrice,
      { value: listingPrice }
    );

    const [ownerAddress, buyerAddress] = await ethers.getSigners();

    console.log("ownerAddress", ownerAddress.address);
    console.log("buyerAddress", buyerAddress.address);

    /* execute sale of token to another user */
    await nftMarketplace
      .connect(buyerAddress)
      .createMarketSale(1, { value: auctionPrice });

    /* resell token */
    await nftMarketplace
      .connect(buyerAddress)
      .resellToken(1, auctionPrice, { value: listingPrice });

    /* query for and return the unsold items */
    let items = await nftMarketplace.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nftMarketplace.tokenURI(i.tokenId);

        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );

    console.log("items: ", items);
  });
});
