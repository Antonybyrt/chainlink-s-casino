// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title CasinoChip
 * @notice The ERC20 chip (CHIP) used to play in the casino. 1 CHIP is minted per
 *         US dollar of ETH deposited (18 decimals), priced via a Chainlink data feed.
 * @dev Minting and burning are restricted to a single `game` contract (the Blackjack
 *      contract). The deployer wires the game exactly once via `setGame`, after which
 *      the deployer has no further privilege over supply.
 */
contract CasinoChip is ERC20 {
    address public immutable deployer;
    address public game;

    error NotDeployer();
    error GameAlreadySet();
    error ZeroAddress();
    error OnlyGame();

    event GameSet(address indexed game);

    constructor() ERC20("Casino Chip", "CHIP") {
        deployer = msg.sender;
    }

    /**
     * @notice Wires the game contract allowed to mint/burn chips. Callable once.
     * @param _game the Blackjack game contract address
     */
    function setGame(address _game) external {
        if (msg.sender != deployer) revert NotDeployer();
        if (_game == address(0)) revert ZeroAddress();
        if (game != address(0)) revert GameAlreadySet();
        game = _game;
        emit GameSet(_game);
    }

    modifier onlyGame() {
        if (msg.sender != game) revert OnlyGame();
        _;
    }

    /**
     * @notice Mints chips to an account. Only the game contract may call this.
     */
    function mint(address to, uint256 amount) external onlyGame {
        _mint(to, amount);
    }

    /**
     * @notice Burns chips from an account. Only the game contract may call this.
     * @dev No allowance is required: the game is a trusted, authorized minter/burner.
     */
    function burn(address from, uint256 amount) external onlyGame {
        _burn(from, amount);
    }
}
