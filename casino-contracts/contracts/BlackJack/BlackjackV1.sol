// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./BlackjackLibrary.sol";
import "./BlackjackTypes.sol";


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

    // =============================================================
    //                          STATE VARIABLES
    // =============================================================
    
    uint8 public constant limitValue = 21;
    mapping(address => Player) public players;
    mapping(uint256 => Game) public games;
    mapping(address => bool) public blacklist;
    mapping(address => uint256) public activeGame;
    uint256 public gameIdCounter;

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

    // =============================================================
    //                          CONSTRUCTOR
    // =============================================================

    //constructor() payable Ownable(msg.sender){}
    function initialize() payable public initializer {
        gameIdCounter = 0;
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
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
     * @dev the player must indicate his bet, two cards are distributed to the player and dealer, natural Blackjack calculated
     * @param bet the bet of the player
     * @return gameId the id of the game created
     */
    function newGame(uint256 bet) public returns (uint256) {
        if (players[msg.sender].addr == address(0)) revert NotRegistered();
        if (bet == 0 || bet > players[msg.sender].balance) revert InvalidBet();
        if (blacklist[msg.sender] == true) revert NotAllowed();
        if (activeGame[msg.sender] != 0) revert GameAlreadyInProgress();

        gameIdCounter ++;

        return BlackjackLibrary.newGame(bet, gameIdCounter, games, players, activeGame);
    }


    // =============================================================
    //                          FUNCTIONS
    // =============================================================

    /**
     * @notice registers a player to the casino
     * @dev Must send funds to register, funds added to the balance
     */
    function register() public payable {
        if (msg.value == 0) revert NoFundsSent();
        if (players[msg.sender].addr != address(0)) revert AlreadyRegistered();
        if (blacklist[msg.sender] == true) revert NotAllowed();
        players[msg.sender] = Player({
            addr: msg.sender,
            balance: msg.value,
            bet: 0,
            hand: new uint8[](0),
            splitHand: new uint8[](0),
            hasSplit: false,
            isStanding: false
        });
        emit Registered(msg.sender, msg.value);
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
        if (players[msg.sender].balance < game.player.bet) revert InsufficientBalanceToDouble();
        if (game.currentCardIndex >= game.deck.length) revert DeckEmpty();

        players[msg.sender].balance -= game.player.bet;
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
        if (players[msg.sender].balance < game.player.bet) revert InsufficientBalanceToDouble();

        players[msg.sender].balance -= game.player.bet;
        game.player.bet *= 2;
        game.player.hasSplit = true;
        
        uint8 firstRank = game.player.hand[0] % 13;
        uint8 secondRank = game.player.hand[1] % 13;
        if (firstRank != secondRank) revert CardsDoNotMatchForSplit();
        if (players[msg.sender].balance < game.player.bet) revert InsufficientBalanceToSplit();

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
            players[game.player.addr].balance += game.player.bet * 2;
            emit GameResolved(gameId, game.player.addr, Outcome.Win, 100, game.player.bet * 2);
            activeGame[msg.sender] = 0;
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
        
        if (totalPayout > 0) {
            players[game.player.addr].balance += totalPayout;
        }
        
        game.finished = true;
        
        emit GameResolved(gameId, game.player.addr, outcome, winPercentage, totalPayout);
        activeGame[msg.sender] = 0;
    }


    /**
     * @notice allows a player to withdraw funds from the contract.
     * @param amount the amount to withdraw.
     */
    function playerWithdraw(uint256 amount) public {
        if (amount == 0) revert();
        if (amount > players[msg.sender].balance) revert InsufficientBalance();
        if (blacklist[msg.sender] == true) revert NotAllowed();

        players[msg.sender].balance -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();
        emit Withdrawal(msg.sender, amount);
    }

    /**
     * @notice allows depositing funds into the contract.
     */
    function deposit() public payable {
        if (msg.value == 0) revert NoFundsSent();

        uint256 newPlayerbalance = players[msg.sender].balance + msg.value;
        if((newPlayerbalance * 2) >= address(this).balance) revert ExceededLimit();

        players[msg.sender].balance += msg.value;
        emit Deposit(msg.sender, msg.value);
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

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function upgrade(address newImplementation) public onlyOwner {
        upgradeToAndCall(newImplementation, "");
    }
}