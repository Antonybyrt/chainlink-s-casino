import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import hre from "hardhat";

describe("Blackjack", function () {
  let factoryDeployed: Contract;
  let owner: Signer;
  let user: Signer;
  let other: Signer;

  async function deployContract(deployValue = "5") {
    // const Factory = await ethers.getContractFactory("Blackjack");
    // factoryDeployed = await Factory.deploy({ value: ethers.parseEther(deployValue) });
    factoryDeployed = await hre.ethers.deployContract("Blackjack", {value: ethers.parseEther(deployValue)});
  }

  beforeEach(async function () {
    [owner, user, other] = await ethers.getSigners();
    await deployContract("5");
  });

  it("Test 1: Should register a user", async function () {
    const depositAmount = ethers.parseEther("1");
    const tx = await factoryDeployed.connect(user).register({ value: depositAmount });
    await tx.wait();

    const player = await factoryDeployed.players(await user.getAddress());
    expect(player.addr).to.equal(await user.getAddress());
    expect(player.balance).to.equal(depositAmount);
  });

  it("Test 2: Should revert registration with no funds", async function () {
    await expect(
      factoryDeployed.connect(other).register({ value: 0 })
    ).to.be.revertedWithCustomError(factoryDeployed, "NoFundsSent");
  });

  it("Test 3: Should revert registration if already registered", async function () {
    const depositAmount = ethers.parseEther("1");
    await factoryDeployed.connect(user).register({ value: depositAmount });
    await expect(
      factoryDeployed.connect(user).register({ value: depositAmount })
    ).to.be.revertedWithCustomError(factoryDeployed, "AlreadyRegistered");
  });

  it("Test 4: Should revert deposit if deposit amount is 0", async function () {
    // On doit être enregistré au préalable
    const depositAmount = ethers.parseEther("1");
    await factoryDeployed.connect(user).register({ value: depositAmount });
    await expect(
      factoryDeployed.connect(user).deposit({ value: 0 })
    ).to.be.revertedWithCustomError(factoryDeployed, "NoFundsSent");
  });

  it("Test 5: Should revert deposit if deposit exceeds allowed limit", async function () {
    const initialDeposit = ethers.parseEther("1");
    await factoryDeployed.connect(user).register({ value: initialDeposit });

    const tooHighDeposit = ethers.parseEther("4");
    await expect(
      factoryDeployed.connect(user).deposit({ value: tooHighDeposit })
    ).to.be.revertedWithCustomError(factoryDeployed, "ExceededLimit");
  });

  it("Test 6: Should revert newGame if not registered", async function () {
    await expect(
      factoryDeployed.connect(other).newGame(ethers.parseEther("0.5"))
    ).to.be.revertedWithCustomError(factoryDeployed, "NotRegistered");
  });

  it("Test 7: Should revert newGame if bet is 0", async function () {
    const depositAmount = ethers.parseEther("1");
    await factoryDeployed.connect(user).register({ value: depositAmount });
    await expect(
      factoryDeployed.connect(user).newGame(0)
    ).to.be.revertedWithCustomError(factoryDeployed, "InvalidBet");
  });

  it("Test 8: Should revert newGame if bet > player's balance", async function () {
    const depositAmount = ethers.parseEther("1");
    await factoryDeployed.connect(user).register({ value: depositAmount });
    await expect(
      factoryDeployed.connect(user).newGame(ethers.parseEther("2"))
    ).to.be.revertedWithCustomError(factoryDeployed, "InvalidBet");
  });
});
