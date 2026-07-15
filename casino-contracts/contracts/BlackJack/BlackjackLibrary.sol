// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "./BlackjackTypes.sol";

library BlackjackLibrary {
    uint8 public constant LIMIT_VALUE = 21;

    event NewGame(uint256 indexed gameId, address indexed player, uint256 bet);
    event CardDealt(uint256 indexed gameId, address indexed receiver, uint8 card, bool splitHand);
    event GameResolved(uint256 indexed gameId, address indexed player, Outcome outcome, uint256 winPercentage, uint256 totalPayout);

    /**
     * @notice get the value of a card
     * @param card a card to calculate its value
     * @return value value (uint8) of the card
     */
    function getCardValue(uint8 card) internal pure returns (uint8) {
        uint8 rank = card % 13;
        if (rank == 0) {
            return 11;
        } else if (rank >= 10) {
            return 10;
        } else {
            return rank + 1;
        }
    }

    /**
     * @notice Computes the total value of a hand, adjusting Aces (11 becomes 1 if necessary)
     * @param hand array of cards (0 to 51)
     * @return total sum of the hand
     */
    function computeHandTotal(uint8[] memory hand) internal pure returns (uint8) {
        uint8 sum = 0;
        uint8 aces = 0;
        for (uint i = 0; i < hand.length; i++) {
            uint8 value = getCardValue(hand[i]);
            sum += value;
            if (value == 11) {
                aces++;
            }
        }
        while (sum > LIMIT_VALUE && aces > 0) {
            sum -= 10;
            aces--;
        }
        return sum;
    }

    /**
     * @notice checks if there's a Blackjack (exactly 2 cards totaling 21)
     * @param hand cards in hand
     * @return bool true if there's a Blackjack
     */
    function checkBlackjack(uint8[] memory hand) public pure returns (bool) {
        if (hand.length != 2) {
            return false;
        }
        return (getCardValue(hand[0]) + getCardValue(hand[1]) == 21);
    }

    /**
     * @notice shuffles a 52-card deck deterministically from a single random seed
     * @dev the seed is expanded into per-index randomness with keccak256, so a single
     *      Chainlink VRF word yields an unbiased Fisher-Yates shuffle
     * @param seed the random seed provided by Chainlink VRF
     * @return deck array which represents the shuffled deck
     */
    function _createShuffledDeck(uint256 seed) internal pure returns (uint8[] memory) {
        uint8[] memory deck = new uint8[](52);
        for (uint8 i = 0; i < 52; i++) {
            deck[i] = i;
        }
        for (uint8 i = 0; i < 52; i++) {
            uint256 n = i + (uint256(keccak256(abi.encode(seed, i))) % (52 - i));
            uint8 temp = deck[i];
            deck[i] = deck[uint8(n)];
            deck[uint8(n)] = temp;
        }
        return deck;
    }

    /**
     * @notice reserves a new game for a registered player
     * @dev the bet (in CHIP) is escrowed by the caller (the game contract) before this
     *      runs; no internal balance is debited here. The deck is NOT shuffled and no
     *      card is dealt: the game waits for the Chainlink VRF callback (dealInitialCards)
     *      which supplies the random seed. The game stage is set to WaitingForRandomness.
     * @param bet the bet of the player (in CHIP)
     * @param newGameId the id assigned to the game being created
     */
    function startGame(
        uint256 bet,
        uint256 newGameId,
        mapping(uint256 => Game) storage games,
        mapping(address => uint256) storage activeGame
    ) public {

        Game storage game = games[newGameId];
        game.id = newGameId;
        game.startTime = block.timestamp;
        game.stage = Stage.WaitingForRandomness;

        game.dealer.addr = address(0);
        game.dealer.balance = 0;
        game.dealer.bet = 0;
        delete game.dealer.hand;
        delete game.dealer.splitHand;
        game.dealer.hasSplit = false;
        game.dealer.isStanding = false;

        game.player.addr = msg.sender;
        game.player.balance = 0;
        game.player.bet = bet;
        delete game.player.hand;
        delete game.player.splitHand;
        game.player.hasSplit = false;
        game.player.isStanding = false;

        game.splitPlayer.addr = address(0);
        game.splitPlayer.balance = 0;
        game.splitPlayer.bet = 0;
        delete game.splitPlayer.hand;
        delete game.splitPlayer.splitHand;
        game.splitPlayer.hasSplit = false;
        game.splitPlayer.isStanding = false;

        delete game.deck;
        game.currentCardIndex = 0;
        game.finished = false;

        activeGame[msg.sender] = newGameId;
    }

    /**
     * @notice shuffles the deck with the VRF seed and deals the initial hands
     * @dev called from the Chainlink VRF callback, so msg.sender is the coordinator:
     *      the player address is always read from game.player.addr, never msg.sender.
     *      Two cards go to the player and two to the dealer, then a natural Blackjack
     *      is resolved immediately. Money is not moved here: the CHIP payout to credit
     *      is returned to the game contract, which performs the transfer.
     * @param seed the random seed provided by Chainlink VRF
     * @param gameId the id of the game to deal
     * @return payout the amount of CHIP owed to the player (0 unless a natural Blackjack)
     */
    function dealInitialCards(
        uint256 seed,
        uint256 gameId,
        mapping(uint256 => Game) storage games,
        mapping(address => uint256) storage activeGame
    ) public returns (uint256 payout) {
        Game storage game = games[gameId];
        address player = game.player.addr;
        uint256 bet = game.player.bet;

        game.deck = _createShuffledDeck(seed);
        game.currentCardIndex = 0;
        game.stage = Stage.PlayHand;

        game.player.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(gameId, player, game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;
        game.player.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(gameId, player, game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;

        game.dealer.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(gameId, address(0), game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;
        game.dealer.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(gameId, address(0), game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;

        emit NewGame(gameId, player, bet);

        bool playerBJ = checkBlackjack(game.player.hand);
        bool dealerBJ = checkBlackjack(game.dealer.hand);
        if (playerBJ) {
            game.stage = Stage.ConcludeHands;
            game.finished = true;
            activeGame[player] = 0;
            if (dealerBJ) {
                payout = bet; // refund the escrowed bet (push)
                emit GameResolved(gameId, player, Outcome.Push, 0, bet);
            } else {
                uint256 winnings = (bet * 3) / 2;
                payout = bet + winnings; // 2.5x bet (3:2 blackjack)
                emit GameResolved(gameId, player, Outcome.Win, 50, winnings);
            }
        }
    }
}
