// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

enum Stage {
    Bet,
    PlayHand,
    PlaySplitHand,
    ConcludeHands
}

enum Outcome {
    Lost,
    Push,
    Win,
    Split
}

struct Player {
    address addr;
    uint256 balance;
    uint256 bet;
    uint8[] hand;
    uint8[] splitHand;
    bool hasSplit;
    bool isStanding;
}

struct Game {
    uint256 id;
    uint256 startTime;
    Stage stage;
    Player dealer;
    Player player;
    Player splitPlayer;
    uint8[] deck;
    uint256 currentCardIndex;
    bool finished;
}
