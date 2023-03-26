const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ERC20 Tokens Exercise 1", () => {
  let deployer, user1, user2, user3;
  let token;

  const DEPLOYER_MINT = ethers.utils.parseEther("100000");
  const USERS_MINT = ethers.utils.parseEther("5000");
  const FIRST_TRANSFER = ethers.utils.parseEther("100");
  const SECOND_TRANSFER = ethers.utils.parseEther("1000");

  before(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();

    const HackersTokenFactory = await ethers.getContractFactory(
      "contracts/erc20-1/HackersToken.sol:HackersToken",
      deployer
    );

    token = await HackersTokenFactory.deploy();

    await token.mint(deployer.address, DEPLOYER_MINT);
    await token.mint(user1.address, USERS_MINT);
    await token.mint(user2.address, USERS_MINT);
    await token.mint(user3.address, USERS_MINT);

    expect(await token.balanceOf(deployer.address)).to.equal(DEPLOYER_MINT);
    expect(await token.balanceOf(user2.address)).to.equal(USERS_MINT);
  });

  it("Transfer tests", async () => {
    // First transfer
    await token.connect(user2).transfer(user3.address, FIRST_TRANSFER);

    // Approval & Allowance test
    await token.connect(user3).approve(user1.address, SECOND_TRANSFER);
    expect(await token.allowance(user3.address, user1.address)).to.equal(
      SECOND_TRANSFER
    );

    // Second transfer
    await token
      .connect(user1)
      .transferFrom(user3.address, user1.address, SECOND_TRANSFER);

    // Checking balances after transfer
    expect(await token.balanceOf(user1.address)).to.equal(
      USERS_MINT.add(SECOND_TRANSFER)
    );
    expect(await token.balanceOf(user2.address)).to.equal(
      USERS_MINT.sub(FIRST_TRANSFER)
    );
    expect(await token.balanceOf(user3.address)).to.equal(
      USERS_MINT.add(FIRST_TRANSFER).sub(SECOND_TRANSFER)
    );
  });
});
