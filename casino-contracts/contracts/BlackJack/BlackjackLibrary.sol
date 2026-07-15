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
     * @notice internal function to shuffle a deck
     * @return deck array which represents the shuffled deck
     */
    function _createShuffledDeck() internal view returns (uint8[] memory) {
        uint8[] memory deck = new uint8[](52);
        for (uint8 i = 0; i < 52; i++) {
            deck[i] = i;
        }
        for (uint8 i = 0; i < 52; i++) {
            uint256 n = i + uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % (52 - i);
            uint8 temp = deck[i];
            deck[i] = deck[uint8(n)];
            deck[uint8(n)] = temp;
        }
        return deck;
    }

    /**
     * @notice starts a new game for a registered player
     * @dev the player must indicate his bet, two cards are distributed to the player and dealer, natural Blackjack calculated
     * @param bet the bet of the player
     * @return newGameId the id of the game created
     */
    function newGame(
        uint256 bet,
        uint256 gameIdCounter,
        mapping(uint256 => Game) storage games,
        mapping(address => Player) storage players,
        mapping(address => uint256) storage activeGame
    ) public returns (uint256 newGameId) {

        players[msg.sender].balance -= bet;
        
        newGameId = gameIdCounter;
        
        uint8[] memory deck = _createShuffledDeck();
        
        Game storage game = games[newGameId];
        game.id = newGameId;
        game.startTime = block.timestamp;
        game.stage = Stage.PlayHand;
        
        game.dealer.addr = address(0);
        game.dealer.balance = 0;
        game.dealer.bet = 0;
        delete game.dealer.hand;
        delete game.dealer.splitHand;
        game.dealer.hasSplit = false;
        game.dealer.isStanding = false;
        
        game.player.addr = msg.sender;
        game.player.balance = players[msg.sender].balance;
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
        
        game.deck = deck;
        game.currentCardIndex = 0;
        game.finished = false;
        
        activeGame[msg.sender] = newGameId;
        
        game.player.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(newGameId, game.player.addr, game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;
        game.player.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(newGameId, game.player.addr, game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;
        
        game.dealer.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(newGameId, address(0), game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;
        game.dealer.hand.push(game.deck[game.currentCardIndex]);
        emit CardDealt(newGameId, address(0), game.deck[game.currentCardIndex], false);
        game.currentCardIndex++;
        
        bool playerBJ = checkBlackjack(game.player.hand);
        bool dealerBJ = checkBlackjack(game.dealer.hand);
        if (playerBJ) {
            game.stage = Stage.ConcludeHands;
            game.finished = true;
            activeGame[msg.sender] = 0;
            Outcome outcome;
            if (dealerBJ) {
                players[msg.sender].balance += bet;
                outcome = Outcome.Push;
                emit NewGame(newGameId, msg.sender, bet);
                emit GameResolved(newGameId, game.player.addr, outcome, 0, bet);
            } else {
                uint256 winnings = (bet * 3) / 2;
                players[msg.sender].balance += bet + winnings;
                outcome = Outcome.Win;
                emit NewGame(newGameId, msg.sender, bet);
                emit GameResolved(newGameId, game.player.addr, outcome, 50, winnings);
            }
        }
        return newGameId;
    }
}
