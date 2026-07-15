// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

/**
 * @title VRFCoordinatorMock
 * @notice Minimal test-only stand-in for the Chainlink VRF v2.5 coordinator.
 * @dev Implements only the request/callback surface exercised by BlackjackV1:
 *      `requestRandomWords` records the caller and returns an incrementing id, and
 *      `fulfillRandomWords` calls the consumer's `rawFulfillRandomWords` — exactly
 *      like the real coordinator. This avoids the full SubscriptionAPI (and its
 *      pinned OpenZeppelin v4 dependency) which conflicts with this project's OZ v5.
 */
interface IVRFConsumerRaw {
    function rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords) external;
}

contract VRFCoordinatorMock {
    uint256 public nextRequestId = 1;
    mapping(uint256 => address) public requesterOf;

    event RandomWordsRequested(uint256 indexed requestId, address indexed requester, uint32 numWords);
    event RandomWordsFulfilled(uint256 indexed requestId, address indexed consumer);

    /// @notice Matches IVRFCoordinatorV2Plus.requestRandomWords selector.
    function requestRandomWords(
        VRFV2PlusClient.RandomWordsRequest calldata req
    ) external returns (uint256 requestId) {
        requestId = nextRequestId++;
        requesterOf[requestId] = msg.sender;
        emit RandomWordsRequested(requestId, msg.sender, req.numWords);
    }

    /// @notice Delivers a single caller-supplied random word to the consumer.
    function fulfillRandomWordsWithOverride(uint256 requestId, uint256[] memory words) public {
        address consumer = requesterOf[requestId];
        require(consumer != address(0), "unknown request");
        emit RandomWordsFulfilled(requestId, consumer);
        IVRFConsumerRaw(consumer).rawFulfillRandomWords(requestId, words);
    }

    /// @notice Delivers a deterministic pseudo-random word derived from the request id.
    function fulfillRandomWords(uint256 requestId, address /* consumer */) external {
        uint256[] memory words = new uint256[](1);
        words[0] = uint256(keccak256(abi.encode("vrf-mock", requestId)));
        fulfillRandomWordsWithOverride(requestId, words);
    }
}
