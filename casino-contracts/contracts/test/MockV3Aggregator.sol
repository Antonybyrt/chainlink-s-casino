// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title MockV3Aggregator
 * @notice Test-only Chainlink data feed. Returns a settable answer with a fresh
 *         `updatedAt` timestamp so consumers with staleness checks accept it.
 */
contract MockV3Aggregator is AggregatorV3Interface {
    uint8 private immutable _decimals;
    int256 public answer;
    uint256 public roundId;

    constructor(uint8 decimals_, int256 initialAnswer) {
        _decimals = decimals_;
        answer = initialAnswer;
        roundId = 1;
    }

    function setAnswer(int256 newAnswer) external {
        answer = newAnswer;
        roundId++;
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function description() external pure override returns (string memory) {
        return "MockV3Aggregator";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function getRoundData(
        uint80 _roundId
    )
        external
        view
        override
        returns (uint80, int256, uint256, uint256, uint80)
    {
        return (_roundId, answer, block.timestamp, block.timestamp, _roundId);
    }

    function latestRoundData()
        external
        view
        override
        returns (uint80, int256, uint256, uint256, uint80)
    {
        return (uint80(roundId), answer, block.timestamp, block.timestamp, uint80(roundId));
    }
}
