const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Randombness Vulnerabilities Exercise 2", () => {
  let deployer, attacker;
  const INITIAL_POT = ethers.utils.parseEther("20");
  const GAME_FEE = ethers.utils.parseEther("1");

  before(async () => {
    [deployer, attacker] = await ethers.getSigners();
    this.attackerInitialBalance = await ethers.provider.getBalance(
      attacker.address
    );

    // Deploy wallet and deposit ETH
    const gameFactory = await ethers.getContractFactory(
      "contracts/randomness-vulnerabilities-2/Game2.sol:Game2",
      deployer
    );
    this.game = await gameFactory.deploy({ value: INITIAL_POT });

    let inGame = await ethers.provider.getBalance(this.game.address);
    expect(inGame).to.equal(INITIAL_POT);
  });

  it("Exploit", async () => {
    const attackGameFactory = await ethers.getContractFactory(
      "contracts/randomness-vulnerabilities-2/solution/AttackGame2.sol:AttackGame2",
      attacker
    );
    this.attackerContract = await attackGameFactory.deploy(this.game.address);

    for (let i = 0; i < 5; i++) {
      console.log(`Round ${i}`);
      await (await this.attackerContract.attack({ value: GAME_FEE })).wait();
    }
  });

  after(async () => {
    // Game funds were stolen
    expect(await ethers.provider.getBalance(this.game.address)).to.equal(0);

    // Attacker supposed to own the stolen ETH (-0.2 ETH for gas)
    expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
      this.attackerInitialBalance
        .add(INITIAL_POT)
        .sub(ethers.utils.parseEther("0.2"))
    );
  });
});
