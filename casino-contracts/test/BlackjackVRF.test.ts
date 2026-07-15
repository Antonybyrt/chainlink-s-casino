import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract, Signer } from "ethers";

const KEY_HASH =
  "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae";
const SUB_ID =
  39112278833581689294166306650944393924609043833854182712739207415929256164503n;

// Price feed: ETH/USD, 8 decimals, $2000 per ETH
const FEED_DECIMALS = 8;
const ETH_USD_PRICE = 2000n * 10n ** 8n; // 2000e8

const STAGE_PLAY_HAND = 1n;
const STAGE_CONCLUDE_HANDS = 3n;
const STAGE_WAITING_FOR_RANDOMNESS = 4n;

function eventArg(contract: Contract, receipt: any, name: string) {
  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed?.name === name) return parsed.args;
    } catch {
      /* not from this contract */
    }
  }
  return undefined;
}

function countEvents(contract: Contract, receipt: any, name: string) {
  let count = 0;
  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed?.name === name) count++;
    } catch {
      /* ignore */
    }
  }
  return count;
}

// chips (18 dec) = eth(wei) * price / 10^feedDecimals
function chipsForEth(ethWei: bigint) {
  return (ethWei * ETH_USD_PRICE) / 10n ** BigInt(FEED_DECIMALS);
}

describe("BlackjackV1 + Chainlink VRF v2.5 + CHIP economy", function () {
  let owner: Signer;
  let player: Signer;
  let mock: Contract;
  let feed: Contract;
  let chip: Contract;
  let blackjack: Contract;
  let blackjackAddress: string;
  let mockAddress: string;
  let chipAddress: string;

  async function deployAll() {
    const Mock = await ethers.getContractFactory("VRFCoordinatorMock");
    mock = (await Mock.deploy()) as unknown as Contract;
    await mock.waitForDeployment();
    mockAddress = await mock.getAddress();

    const Feed = await ethers.getContractFactory("MockV3Aggregator");
    feed = (await Feed.deploy(FEED_DECIMALS, ETH_USD_PRICE)) as unknown as Contract;
    await feed.waitForDeployment();

    const Chip = await ethers.getContractFactory("CasinoChip");
    chip = (await Chip.deploy()) as unknown as Contract;
    await chip.waitForDeployment();
    chipAddress = await chip.getAddress();

    const Library = await ethers.getContractFactory("BlackjackLibrary");
    const library = await Library.deploy();
    await library.waitForDeployment();

    const BlackjackV1 = await ethers.getContractFactory("BlackjackV1", {
      libraries: { BlackjackLibrary: await library.getAddress() },
    });
    blackjack = (await upgrades.deployProxy(
      BlackjackV1,
      [mockAddress, KEY_HASH, SUB_ID, chipAddress, await feed.getAddress()],
      { initializer: "initialize", kind: "uups", unsafeAllowLinkedLibraries: true }
    )) as unknown as Contract;
    await blackjack.waitForDeployment();
    blackjackAddress = await blackjack.getAddress();

    // Wire the chip minter to the game
    await chip.setGame(blackjackAddress);
  }

  beforeEach(async function () {
    [owner, player] = await ethers.getSigners();
    await deployAll();

    // Seed the house reserve (owner deposits 10 ETH -> 20,000 CHIP)
    await blackjack.connect(owner).fundHouse({ value: ethers.parseEther("10") });

    // Player registers and buys chips with 1 ETH -> 2,000 CHIP
    await blackjack.connect(player).register({ value: ethers.parseEther("1") });
    // Approve the game to escrow chips
    await chip.connect(player).approve(blackjackAddress, ethers.MaxUint256);
  });

  describe("CHIP economy", function () {
    it("mints CHIP on register based on the USD value of ETH", async function () {
      const p = await player.getAddress();
      expect(await chip.balanceOf(p)).to.equal(chipsForEth(ethers.parseEther("1")));
      expect(await chip.balanceOf(p)).to.equal(2000n * 10n ** 18n);
    });

    it("mints CHIP via buyChips at the current price", async function () {
      const p = await player.getAddress();
      const before = await chip.balanceOf(p);
      await blackjack.connect(player).buyChips({ value: ethers.parseEther("0.5") });
      expect((await chip.balanceOf(p)) - before).to.equal(chipsForEth(ethers.parseEther("0.5")));
    });

    it("reflects the price feed when it changes", async function () {
      await feed.setAnswer(3000n * 10n ** 8n); // $3000 / ETH
      const q = await blackjack.quoteChipsForEth(ethers.parseEther("1"));
      expect(q).to.equal(3000n * 10n ** 18n);
    });

    it("cashes out CHIP back to ETH at the current price", async function () {
      const p = await player.getAddress();
      const chipsToRedeem = 1000n * 10n ** 18n; // 1000 CHIP -> 0.5 ETH at $2000
      const expectedEth = (chipsToRedeem * 10n ** BigInt(FEED_DECIMALS)) / ETH_USD_PRICE;

      const chipBefore = await chip.balanceOf(p);
      const ethBefore = await ethers.provider.getBalance(p);
      const tx = await blackjack.connect(player).cashOut(chipsToRedeem);
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      const ethAfter = await ethers.provider.getBalance(p);

      expect(chipBefore - (await chip.balanceOf(p))).to.equal(chipsToRedeem);
      expect(ethAfter - ethBefore + gasCost).to.equal(expectedEth);
    });

    it("only the owner can fund the house", async function () {
      await expect(
        blackjack.connect(player).fundHouse({ value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(blackjack, "OwnableUnauthorizedAccount");
    });
  });

  describe("Betting escrow", function () {
    it("escrows the bet in CHIP when starting a game", async function () {
      const p = await player.getAddress();
      const bet = 10n * 10n ** 18n; // 10 CHIP
      const walletBefore = await chip.balanceOf(p);
      const houseBefore = await chip.balanceOf(blackjackAddress);

      await blackjack.connect(player).newGame(bet);

      expect(walletBefore - (await chip.balanceOf(p))).to.equal(bet);
      expect((await chip.balanceOf(blackjackAddress)) - houseBefore).to.equal(bet);
    });

    it("reverts newGame without a token approval", async function () {
      const [, , fresh] = await ethers.getSigners();
      await blackjack.connect(fresh).register({ value: ethers.parseEther("1") });
      // fresh has chips but has NOT approved the game
      await expect(blackjack.connect(fresh).newGame(10n * 10n ** 18n)).to.be.reverted;
    });

    it("reverts newGame when the player has no chips", async function () {
      const [, , , broke] = await ethers.getSigners();
      await blackjack.connect(broke).register(); // registers with no ETH -> 0 chips
      await chip.connect(broke).approve(blackjackAddress, ethers.MaxUint256);
      await expect(
        blackjack.connect(broke).newGame(10n * 10n ** 18n)
      ).to.be.revertedWithCustomError(blackjack, "InsufficientChips");
    });
  });

  describe("VRF flow", function () {
    it("stores the VRF + feed configuration on initialize", async function () {
      expect(await blackjack.s_vrfCoordinator()).to.equal(mockAddress);
      expect(await blackjack.s_subscriptionId()).to.equal(SUB_ID);
      expect(await blackjack.chip()).to.equal(chipAddress);
      expect(await blackjack.priceFeed()).to.equal(await feed.getAddress());
    });

    it("newGame requests randomness and deals no card yet", async function () {
      const bet = 10n * 10n ** 18n;
      const receipt = await (await blackjack.connect(player).newGame(bet)).wait();
      const requested = eventArg(blackjack, receipt, "RandomnessRequested")!;
      const game = await blackjack.games(requested.gameId);
      expect(game.stage).to.equal(STAGE_WAITING_FOR_RANDOMNESS);
      expect(game.currentCardIndex).to.equal(0n);
    });

    it("deals four cards when the VRF request is fulfilled", async function () {
      const bet = 10n * 10n ** 18n;
      const startReceipt = await (await blackjack.connect(player).newGame(bet)).wait();
      const { requestId, gameId } = eventArg(blackjack, startReceipt, "RandomnessRequested")!;

      const fulfillReceipt = await (
        await mock.fulfillRandomWordsWithOverride(requestId, [123456789n])
      ).wait();

      expect(countEvents(blackjack, fulfillReceipt, "CardDealt")).to.equal(4);
      const game = await blackjack.games(gameId);
      expect(game.currentCardIndex).to.equal(4n);
      expect([STAGE_PLAY_HAND, STAGE_CONCLUDE_HANDS]).to.include(game.stage);
      expect(await blackjack.requestIdToGameId(requestId)).to.equal(0n);
    });

    it("reverts if a non-coordinator tries to fulfill", async function () {
      const startReceipt = await (await blackjack.connect(player).newGame(10n * 10n ** 18n)).wait();
      const { requestId } = eventArg(blackjack, startReceipt, "RandomnessRequested")!;
      await expect(
        blackjack.connect(player).rawFulfillRandomWords(requestId, [1n])
      ).to.be.revertedWithCustomError(blackjack, "OnlyCoordinatorCanFulfill");
    });

    it("prevents a second game while one is pending", async function () {
      await (await blackjack.connect(player).newGame(10n * 10n ** 18n)).wait();
      await expect(
        blackjack.connect(player).newGame(10n * 10n ** 18n)
      ).to.be.revertedWithCustomError(blackjack, "GameAlreadyInProgress");
    });
  });

  describe("Payouts conserve CHIP during play", function () {
    it("keeps total CHIP supply constant across a full game (transfers only)", async function () {
      const bet = 10n * 10n ** 18n;
      const supplyBefore = await chip.totalSupply();

      const startReceipt = await (await blackjack.connect(player).newGame(bet)).wait();
      const { requestId, gameId } = eventArg(blackjack, startReceipt, "RandomnessRequested")!;
      await (await mock.fulfillRandomWordsWithOverride(requestId, [123456789n])).wait();

      let game = await blackjack.games(gameId);
      if (game.stage === STAGE_PLAY_HAND) {
        await (await blackjack.connect(player).stand(gameId)).wait();
      }
      game = await blackjack.games(gameId);
      expect(game.finished).to.equal(true);

      // No mint/burn happens during a game: only escrow/transfer between player and house
      expect(await chip.totalSupply()).to.equal(supplyBefore);
    });
  });
});
