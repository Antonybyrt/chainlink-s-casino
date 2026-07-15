// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "../CasinoChip.sol";
import "./BlackjackLibrary.sol";
import "./BlackjackTypes.sol";


/**
 * @title BlackjackV1
 * @notice Upgradeable (UUPS) Blackjack casino using Chainlink VRF v2.5 to shuffle the deck.
 * @dev Starting a game is a two-step, asynchronous flow:
 *      1. `newGame` locks the bet and requests randomness from the VRF coordinator.
 *      2. `rawFulfillRandomWords` (called back by the coordinator) shuffles the deck
 *         with the verifiable random word and deals the initial hands.
 *      The contract does not inherit VRFConsumerBaseV2Plus because that base uses a
 *      constructor and ConfirmedOwner, which are incompatible with the proxy /
 *      OwnableUpgradeable pattern. The consumer logic is reproduced in an
 *      initializer-based, upgrade-safe form instead.
 */
contract BlackjackV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using BlackjackLibrary for uint8[];

    // =============================================================
    //                          ERRORS
    // =============================================================

    error NoFundsSent();
    error AlreadyRegistered();
    error NotRegistered();
    error InvalidBet();
    error InsufficientBalance();
    error GameFinished();
    error NotYourGame();
    error DeckEmpty();
    error DoubleOnlyAllowed();
    error InsufficientBalanceToDouble();
    error CardsDoNotMatchForSplit();
    error InsufficientBalanceToSplit();
    error NotEnoughCardsForSplit();
    error TransferFailed();
    error SplitOnlyAllowedWith2Cards();
    error NotAllowed();
    error ExceededLimit();
    error GameAlreadyInProgress();
    error OnlyCoordinatorCanFulfill(address have, address want);
    error ZeroAddress();
    error RequestNotFound(uint256 requestId);
    error GameNotWaitingForRandomness(uint256 gameId);
    error InvalidPrice();
    error StalePrice();
    error EthTransferFailed();
    error InsufficientChips();
    error NothingToConvert();

    // =============================================================
    //                          STATE VARIABLES
    // =============================================================
    
    uint8 public constant limitValue = 21;
    mapping(address => Player) public players;
    mapping(uint256 => Game) public games;
    mapping(address => bool) public blacklist;
    mapping(address => uint256) public activeGame;
    uint256 public gameIdCounter;

    // ----- Chainlink VRF v2.5 configuration (appended to preserve storage layout) -----
    IVRFCoordinatorV2Plus public s_vrfCoordinator;
    bytes32 public s_keyHash;
    uint256 public s_subscriptionId;
    uint32 public s_callbackGasLimit;
    uint16 public s_requestConfirmations;
    uint32 public s_numWords;
    bool public s_nativePayment;
    // maps a VRF request id to the game it will deal
    mapping(uint256 => uint256) public requestIdToGameId;

    // ----- Casino chip economy -----
    CasinoChip public chip;                 // the ERC20 chip used to bet (1 CHIP = 1 USD)
    AggregatorV3Interface public priceFeed; // ETH/USD Chainlink data feed
    uint256 public constant PRICE_STALENESS = 6 hours; // max age of a price answer

    // =============================================================
    //                          EVENTS
    // =============================================================

    event Registered(address indexed player, uint256 amount);
    event Deposit(address indexed player, uint256 amount);
    event CardDealt(uint256 indexed gameId, address indexed receiver, uint8 card, bool splitHand);
    event PlayerAction(uint256 indexed gameId, address indexed player, string action, uint256 total);
    event DealerAction(uint256 indexed gameId, uint256 dealerTotal);
    event GameResolved(uint256 indexed gameId, address indexed player, Outcome outcome, uint256 winPercentage, uint256 totalPayout);
    event Withdrawal(address indexed player, uint256 amount);
    event Blacklisted(address indexed player);
    event RemovedFromBlacklist(address indexed player);
    event GameStopped(uint256 indexed gameId, address indexed player);
    event RandomnessRequested(uint256 indexed gameId, address indexed player, uint256 requestId);
    event VrfConfigUpdated(bytes32 keyHash, uint256 subscriptionId, uint32 callbackGasLimit, uint16 requestConfirmations, bool nativePayment);
    event CoordinatorUpdated(address indexed coordinator);
    event ChipsPurchased(address indexed player, uint256 ethIn, uint256 ethUsdPrice, uint256 chipsOut);
    event ChipsCashedOut(address indexed player, uint256 chipsIn, uint256 ethUsdPrice, uint256 ethOut);
    event HouseFunded(address indexed from, uint256 ethIn, uint256 chipsMinted);
    event PriceFeedUpdated(address indexed priceFeed);

    // =============================================================
    //                          CONSTRUCTOR
    // =============================================================

    //constructor() payable Ownable(msg.sender){}
    /**
     * @notice Initializes the proxy with the Chainlink VRF v2.5 configuration, the CHIP
     *         token and the ETH/USD price feed.
     * @param vrfCoordinator address of the VRF v2.5 coordinator on the target network
     * @param keyHash gas-lane key hash to use for randomness requests
     * @param subscriptionId the VRF subscription id that funds the requests
     * @param chipToken address of the deployed CasinoChip ERC20
     * @param ethUsdPriceFeed address of the Chainlink ETH/USD data feed
     */
    function initialize(
        address vrfCoordinator,
        bytes32 keyHash,
        uint256 subscriptionId,
        address chipToken,
        address ethUsdPriceFeed
    ) payable public initializer {
        if (vrfCoordinator == address(0)) revert ZeroAddress();
        if (chipToken == address(0)) revert ZeroAddress();
        if (ethUsdPriceFeed == address(0)) revert ZeroAddress();
        gameIdCounter = 0;
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        s_vrfCoordinator = IVRFCoordinatorV2Plus(vrfCoordinator);
        s_keyHash = keyHash;
        s_subscriptionId = subscriptionId;
        s_callbackGasLimit = 500000;
        s_requestConfirmations = 3;
        s_numWords = 1;
        s_nativePayment = false;

        chip = CasinoChip(chipToken);
        priceFeed = AggregatorV3Interface(ethUsdPriceFeed);
    }

    // =============================================================
    //                          LIBRARY FUNCTIONS
    // =============================================================

    /**
     * @notice Computes the total value of a hand, adjusting Aces (11 becomes 1 if necessary)
     * @param hand array of cards (0 to 51)
     * @return total sum of the hand
     */
    function computeHandTotal(uint8[] memory hand) public pure returns (uint8) {
        return BlackjackLibrary.computeHandTotal(hand);
    }

    /**
     * @notice starts a new game for a registered player
     * @dev locks the bet, creates a game in the WaitingForRandomness stage and requests a
     *      verifiable random word from Chainlink VRF. The cards are NOT dealt here: the
     *      coordinator later calls back rawFulfillRandomWords, which shuffles the deck and
     *      deals the initial hands.
     * @param bet the bet of the player
     * @return gameId the id of the game created
     */
    function newGame(uint256 bet) public returns (uint256) {
        if (players[msg.sender].addr == address(0)) revert NotRegistered();
        if (bet == 0) revert InvalidBet();
        if (blacklist[msg.sender] == true) revert NotAllowed();
        if (activeGame[msg.sender] != 0) revert GameAlreadyInProgress();

        // Escrow the bet in CHIP (requires prior approve); reverts on insufficient funds/allowance
        if (chip.balanceOf(msg.sender) < bet) revert InsufficientChips();
        chip.transferFrom(msg.sender, address(this), bet);

        gameIdCounter ++;
        uint256 gameId = gameIdCounter;

        BlackjackLibrary.startGame(bet, gameId, games, activeGame);

        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: s_requestConfirmations,
                callbackGasLimit: s_callbackGasLimit,
                numWords: s_numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: s_nativePayment})
                )
            })
        );

        requestIdToGameId[requestId] = gameId;
        emit RandomnessRequested(gameId, msg.sender, requestId);

        return gameId;
    }

    // =============================================================
    //                          CHAINLINK VRF
    // =============================================================

    /**
     * @notice Entry point called by the VRF coordinator to deliver the random words.
     * @dev Mirrors VRFConsumerBaseV2Plus.rawFulfillRandomWords but reads the coordinator
     *      from storage (set in initialize) so it is proxy/upgrade safe. Only the
     *      configured coordinator may call it.
     * @param requestId the id returned by the original requestRandomWords call
     * @param randomWords the verifiable random words produced by VRF
     */
    function rawFulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) external {
        if (msg.sender != address(s_vrfCoordinator)) {
            revert OnlyCoordinatorCanFulfill(msg.sender, address(s_vrfCoordinator));
        }
        fulfillRandomWords(requestId, randomWords);
    }

    /**
     * @notice Shuffles the deck with the VRF seed and deals the initial hands.
     * @param requestId the id of the fulfilled request
     * @param randomWords the verifiable random words; randomWords[0] seeds the shuffle
     */
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal {
        uint256 gameId = requestIdToGameId[requestId];
        if (gameId == 0) revert RequestNotFound(requestId);

        Game storage game = games[gameId];
        if (game.stage != Stage.WaitingForRandomness) revert GameNotWaitingForRandomness(gameId);

        delete requestIdToGameId[requestId];

        address player = game.player.addr;
        uint256 payout = BlackjackLibrary.dealInitialCards(randomWords[0], gameId, games, activeGame);
        if (payout > 0) {
            chip.transfer(player, payout); // pay out a natural blackjack (or push refund)
        }
    }


    // =============================================================
    //                          FUNCTIONS
    // =============================================================

    /**
     * @notice registers a player to the casino
     * @dev Registration is the participation gate. Any ETH sent is converted to CHIP
     *      (via the price feed) and minted to the player's wallet, so a player can
     *      register and buy chips in a single call.
     */
    function register() public payable {
        if (players[msg.sender].addr != address(0)) revert AlreadyRegistered();
        if (blacklist[msg.sender] == true) revert NotAllowed();
        players[msg.sender] = Player({
            addr: msg.sender,
            balance: 0,
            bet: 0,
            hand: new uint8[](0),
            splitHand: new uint8[](0),
            hasSplit: false,
            isStanding: false
        });
        emit Registered(msg.sender, msg.value);
        if (msg.value > 0) {
            _buyChips(msg.sender, msg.value);
        }
    }

    /**
     * @notice buys CHIP by depositing ETH, priced in USD via the Chainlink feed.
     * @dev 1 CHIP is minted per US dollar of ETH sent (18 decimals). Chips are minted
     *      to the caller's wallet; to play they must be approved to this contract.
     */
    function buyChips() public payable {
        _buyChips(msg.sender, msg.value);
    }

    /**
     * @notice alias of buyChips kept for backwards compatibility.
     */
    function deposit() public payable {
        _buyChips(msg.sender, msg.value);
    }

    /**
     * @notice converts CHIP back to ETH at the current price, burning the chips.
     * @param chipAmount amount of CHIP (18 decimals) to redeem
     */
    function cashOut(uint256 chipAmount) public {
        if (chipAmount == 0) revert NothingToConvert();
        if (blacklist[msg.sender] == true) revert NotAllowed();
        if (chip.balanceOf(msg.sender) < chipAmount) revert InsufficientChips();

        (uint256 price, uint8 feedDecimals) = _latestEthUsd();
        // ethOut = chipAmount * 10^feedDecimals / price
        uint256 ethOut = (chipAmount * (10 ** feedDecimals)) / price;
        if (ethOut == 0 || ethOut > address(this).balance) revert InsufficientBalance();

        chip.burn(msg.sender, chipAmount);
        (bool success, ) = payable(msg.sender).call{value: ethOut}("");
        if (!success) revert EthTransferFailed();
        emit ChipsCashedOut(msg.sender, chipAmount, price, ethOut);
    }

    /**
     * @notice performs a Hit action for the player (draw an additional card)
     * @param gameId the game identifier
     * @param splitHand tells us where to hit
     * @return totalValue new total value of the player's hand
     */
    function hit(uint256 gameId, bool splitHand) public returns (uint8) {
        Game storage game = games[gameId];
        if (game.finished) revert GameFinished();
        if (msg.sender != game.player.addr) revert NotYourGame();
        if (game.currentCardIndex >= game.deck.length) revert DeckEmpty();

        if (!splitHand) {
            game.player.hand.push(game.deck[game.currentCardIndex]);
            emit CardDealt(gameId, game.player.addr, game.deck[game.currentCardIndex], false);
            game.currentCardIndex++;
        } else {
            game.player.splitHand.push(game.deck[game.currentCardIndex]);
            emit CardDealt(gameId, game.player.addr, game.deck[game.currentCardIndex], true);
            game.currentCardIndex++;
        }

        uint8 totalValue = computeHandTotal(game.player.hand);
        uint8 totalValueSplit = computeHandTotal(game.player.splitHand);
        emit PlayerAction(gameId, game.player.addr, "Hit", totalValue);

        if (totalValueSplit > 0) {
            if (totalValue > limitValue && totalValueSplit > limitValue) {
                game.finished = true;
                emit GameResolved(gameId, game.player.addr, Outcome.Lost, 0, 0);
                activeGame[msg.sender] = 0;
            }
        } else {
            if (totalValue > limitValue) {
                game.finished = true;
                emit GameResolved(gameId, game.player.addr, Outcome.Lost, 0, 0);
                activeGame[msg.sender] = 0;
            }
        }
        return totalValue;
    }

    /**
     * @notice performs a Stand action for the player (end his turn)
     * @param gameId the game identifier
     */
    function stand(uint256 gameId) public {
        Game storage game = games[gameId];
        if (game.finished) revert GameFinished();
        if (msg.sender != game.player.addr) revert NotYourGame();

        game.player.isStanding = true;
        emit PlayerAction(gameId, game.player.addr, "Stand", computeHandTotal(game.player.hand));
        game.stage = Stage.ConcludeHands;
        dealerAction(game.id);
    }

    /**
     * @notice performs a Double action for the player (double the bet, draw one card, and stand)
     * @param gameId the game identifier
     */
    function doubleBet(uint256 gameId) public {
        Game storage game = games[gameId];
        if (game.finished) revert GameFinished();
        if (msg.sender != game.player.addr) revert NotYourGame();
        if (game.player.hand.length != 2) revert DoubleOnlyAllowed();
        if (game.currentCardIndex >= game.deck.length) revert DeckEmpty();
        if (chip.balanceOf(msg.sender) < game.player.bet) revert InsufficientBalanceToDouble();

        // Escrow an additional bet equal to the current bet
        chip.transferFrom(msg.sender, address(this), game.player.bet);
        game.player.bet *= 2;

        game.player.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(gameId, game.player.addr, game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;

        uint8 totalValue = computeHandTotal(game.player.hand);
        emit PlayerAction(gameId, game.player.addr, "Double", totalValue);

        if (totalValue > limitValue) {
            game.finished = true;
            emit GameResolved(gameId, game.player.addr, Outcome.Lost, 0, 0);
            activeGame[msg.sender] = 0;
            return;
        }

        game.player.isStanding = true;
        game.stage = Stage.ConcludeHands;
        dealerAction(game.id);
    }

    /**
     * @notice performs a Split action for the player (if the first two cards have the same rank)
     * @param gameId the game identifier
     */
    function split(uint256 gameId) public {
        Game storage game = games[gameId];
        if (game.finished) revert GameFinished();
        if (msg.sender != game.player.addr) revert NotYourGame();
        if (game.player.hand.length != 2) revert SplitOnlyAllowedWith2Cards();

        uint8 firstRank = game.player.hand[0] % 13;
        uint8 secondRank = game.player.hand[1] % 13;
        if (firstRank != secondRank) revert CardsDoNotMatchForSplit();

        // Escrow an additional bet equal to the original bet, doubling the total stake
        uint256 additionalBet = game.player.bet;
        if (chip.balanceOf(msg.sender) < additionalBet) revert InsufficientBalanceToSplit();
        chip.transferFrom(msg.sender, address(this), additionalBet);
        game.player.bet *= 2;
        game.player.hasSplit = true;

        game.player.hand.pop();
        game.splitPlayer.hand.push(game.deck[game.currentCardIndex - 1]);
        emit PlayerAction(gameId, game.player.addr, "Split - move card", computeHandTotal(game.player.hand));

        if (game.currentCardIndex + 1 >= game.deck.length) revert NotEnoughCardsForSplit();
        game.player.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(gameId, game.player.addr, game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;
        game.splitPlayer.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(gameId, game.player.addr, game.deck[game.currentCardIndex], true);
        game.currentCardIndex++;

        emit PlayerAction(gameId, game.player.addr, "Split", computeHandTotal(game.player.hand));
    }

    /**
     * @notice performs the dealer's actions: draws cards until reaching at least 17.
     *         If the dealer busts (total > 21), the player wins automatically.
     * @param gameId the game identifier
     */
    function dealerAction(uint256 gameId) internal {
        Game storage game = games[gameId];
        if (game.finished) revert GameFinished();
        
        while (computeHandTotal(game.dealer.hand) < 17) {
            if (game.currentCardIndex >= game.deck.length) revert DeckEmpty();
            game.dealer.hand.push(game.deck[game.currentCardIndex]);
            emit CardDealt(gameId, address(0), game.deck[game.currentCardIndex], false);
            game.currentCardIndex++;
        }
        
        uint256 dealerTotal = computeHandTotal(game.dealer.hand);
        emit DealerAction(gameId, dealerTotal);
        
        if (dealerTotal > limitValue) {
            game.finished = true;
            uint256 payout = game.player.bet * 2;
            emit GameResolved(gameId, game.player.addr, Outcome.Win, 100, payout);
            activeGame[game.player.addr] = 0;
            chip.transfer(game.player.addr, payout);
            return;
        }
        resolveGame(gameId);
    }

    /**
     * @notice Resolves the game by comparing the dealer's total with the player's hands,
     *         taking into account any split.
     * @param gameId the identifier of the game to resolve.
     */
    function resolveGame(uint256 gameId) internal {
        Game storage game = games[gameId];
        if (game.stage != Stage.ConcludeHands) revert();
        if (game.finished) revert GameFinished();
        
        uint8 dealerTotal = computeHandTotal(game.dealer.hand);
        uint256 totalPayout = 0;
        uint256 totalBet = game.player.bet;
        
        if (game.player.hasSplit) {
            uint256 splitBet = totalBet / 2;
            uint8 splitTotal = computeHandTotal(game.splitPlayer.hand);
            
            if (dealerTotal > limitValue) {
                totalPayout += splitBet * 2;
            } else if (splitTotal > dealerTotal) {
                totalPayout += splitBet * 2;
            } else if (splitTotal == dealerTotal) {
                totalPayout += splitBet;
            }

            uint256 mainBet = totalBet / 2;
            uint8 playerTotal = computeHandTotal(game.player.hand);
            
            if (dealerTotal > limitValue) {
                totalPayout += mainBet * 2;
            } else if (playerTotal > dealerTotal) {
                totalPayout += mainBet * 2;
            } else if (playerTotal == dealerTotal) {
                totalPayout += mainBet;
            }

        } else {
            uint8 playerTotal = computeHandTotal(game.player.hand);
            if (dealerTotal > limitValue) {
                totalPayout += totalBet * 2;
            } else if (playerTotal > dealerTotal) {
                totalPayout += totalBet * 2;
            } else if (playerTotal == dealerTotal) {
                totalPayout += totalBet;
            }

        }
        
        Outcome outcome;
        uint256 winPercentage = 0;

        if (totalPayout == 0) {
            outcome = Outcome.Lost;
        } else if (totalPayout == totalBet) {
            outcome = Outcome.Push;
        } else if (totalPayout > totalBet) {
            outcome = Outcome.Win;
            winPercentage = ((totalPayout - totalBet) * 100) / totalBet;
        }
        
        game.finished = true;

        emit GameResolved(gameId, game.player.addr, outcome, winPercentage, totalPayout);
        activeGame[game.player.addr] = 0;

        if (totalPayout > 0) {
            chip.transfer(game.player.addr, totalPayout);
        }
    }


    /**
     * @notice Funds the house chip reserve so the contract can pay out winnings.
     * @dev The owner deposits ETH, which is converted to CHIP via the price feed and
     *      minted to this contract. This keeps the CHIP supply backed by ETH held here.
     */
    function fundHouse() external payable onlyOwner {
        if (msg.value == 0) revert NoFundsSent();
        (uint256 price, uint8 feedDecimals) = _latestEthUsd();
        uint256 chips = (msg.value * price) / (10 ** feedDecimals);
        if (chips == 0) revert NothingToConvert();
        chip.mint(address(this), chips);
        emit HouseFunded(msg.sender, msg.value, chips);
    }

    /**
     * @notice Converts an ETH amount to CHIP and mints it to `to`.
     */
    function _buyChips(address to, uint256 ethAmount) internal {
        if (ethAmount == 0) revert NoFundsSent();
        (uint256 price, uint8 feedDecimals) = _latestEthUsd();
        uint256 chips = (ethAmount * price) / (10 ** feedDecimals);
        if (chips == 0) revert NothingToConvert();
        chip.mint(to, chips);
        emit ChipsPurchased(to, ethAmount, price, chips);
    }

    /**
     * @notice Reads and validates the latest ETH/USD price.
     * @return price the price in the feed's native decimals
     * @return feedDecimals the number of decimals the feed reports
     */
    function _latestEthUsd() internal view returns (uint256 price, uint8 feedDecimals) {
        (, int256 answer, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        if (answer <= 0) revert InvalidPrice();
        if (updatedAt == 0 || block.timestamp - updatedAt > PRICE_STALENESS) revert StalePrice();
        price = uint256(answer);
        feedDecimals = priceFeed.decimals();
    }

    /**
     * @notice Quotes how many CHIP a given ETH amount would buy at the current price.
     */
    function quoteChipsForEth(uint256 ethAmount) external view returns (uint256) {
        (uint256 price, uint8 feedDecimals) = _latestEthUsd();
        return (ethAmount * price) / (10 ** feedDecimals);
    }

    /**
     * @notice Quotes how much ETH a given CHIP amount would redeem at the current price.
     */
    function quoteEthForChips(uint256 chipAmount) external view returns (uint256) {
        (uint256 price, uint8 feedDecimals) = _latestEthUsd();
        return (chipAmount * (10 ** feedDecimals)) / price;
    }

    // =============================================================
    //                          OWNER FUNCTIONS
    // =============================================================

    /**
     * @notice Blacklists a player.
     * @dev Only callable by the owner.
     * @param _player The address of the player to blacklist.
     */
    function blacklistPlayer(address _player) external onlyOwner {
        blacklist[_player] = true;

        uint256 gameId = activeGame[_player];
        if (gameId != 0) {
            stopGame(gameId);
        }

        emit Blacklisted(_player);
    }

    /**
     * @notice Removes a player from the blacklist.
     * @dev Only callable by the owner.
     * @param _player The address of the player to remove.
     */
    function removeFromBlacklist(address _player) external onlyOwner {
        blacklist[_player] = false;
        emit RemovedFromBlacklist(_player);
    }

    /**
     * @notice Stops a game if the player is inactive.
     * @dev Only callable by the owner.
     * @param gameId The identifier of the game to stop.
     */
    function stopGame(uint256 gameId) public onlyOwner {
        Game storage game = games[gameId];
        if (game.finished) revert GameFinished();
        game.finished = true;
        activeGame[game.player.addr] = 0;
        emit GameStopped(gameId, game.player.addr);
    }

    /**
     * @notice Updates the Chainlink VRF request parameters.
     * @dev Only callable by the owner. Lets the owner tune the gas lane, subscription,
     *      callback gas, confirmations and payment token without redeploying.
     */
    function setVrfConfig(
        bytes32 keyHash,
        uint256 subscriptionId,
        uint32 callbackGasLimit,
        uint16 requestConfirmations,
        bool nativePayment
    ) external onlyOwner {
        s_keyHash = keyHash;
        s_subscriptionId = subscriptionId;
        s_callbackGasLimit = callbackGasLimit;
        s_requestConfirmations = requestConfirmations;
        s_nativePayment = nativePayment;
        emit VrfConfigUpdated(keyHash, subscriptionId, callbackGasLimit, requestConfirmations, nativePayment);
    }

    /**
     * @notice Updates the VRF coordinator address (e.g. after a coordinator migration).
     * @dev Only callable by the owner.
     */
    function setCoordinator(address vrfCoordinator) external onlyOwner {
        if (vrfCoordinator == address(0)) revert ZeroAddress();
        s_vrfCoordinator = IVRFCoordinatorV2Plus(vrfCoordinator);
        emit CoordinatorUpdated(vrfCoordinator);
    }

    /**
     * @notice Updates the ETH/USD price feed address.
     * @dev Only callable by the owner.
     */
    function setPriceFeed(address ethUsdPriceFeed) external onlyOwner {
        if (ethUsdPriceFeed == address(0)) revert ZeroAddress();
        priceFeed = AggregatorV3Interface(ethUsdPriceFeed);
        emit PriceFeedUpdated(ethUsdPriceFeed);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function upgrade(address newImplementation) public onlyOwner {
        upgradeToAndCall(newImplementation, "");
    }
}