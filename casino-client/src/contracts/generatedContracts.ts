import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Blackjack
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const blackjackAbi = [
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'AlreadyRegistered' },
  { type: 'error', inputs: [], name: 'CardsDoNotMatchForSplit' },
  { type: 'error', inputs: [], name: 'DeckEmpty' },
  { type: 'error', inputs: [], name: 'DoubleOnlyAllowed' },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'EthTransferFailed' },
  { type: 'error', inputs: [], name: 'ExceededLimit' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'GameAlreadyInProgress' },
  { type: 'error', inputs: [], name: 'GameFinished' },
  {
    type: 'error',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    name: 'GameNotWaitingForRandomness',
  },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'InsufficientBalanceToDouble' },
  { type: 'error', inputs: [], name: 'InsufficientBalanceToSplit' },
  { type: 'error', inputs: [], name: 'InsufficientChips' },
  { type: 'error', inputs: [], name: 'InvalidBet' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidPrice' },
  { type: 'error', inputs: [], name: 'NoFundsSent' },
  { type: 'error', inputs: [], name: 'NotAllowed' },
  { type: 'error', inputs: [], name: 'NotEnoughCardsForSplit' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotRegistered' },
  { type: 'error', inputs: [], name: 'NotYourGame' },
  { type: 'error', inputs: [], name: 'NothingToConvert' },
  {
    type: 'error',
    inputs: [
      { name: 'have', internalType: 'address', type: 'address' },
      { name: 'want', internalType: 'address', type: 'address' },
    ],
    name: 'OnlyCoordinatorCanFulfill',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    name: 'RequestNotFound',
  },
  { type: 'error', inputs: [], name: 'SplitOnlyAllowedWith2Cards' },
  { type: 'error', inputs: [], name: 'StalePrice' },
  { type: 'error', inputs: [], name: 'TransferFailed' },
  { type: 'error', inputs: [], name: 'UUPSUnauthorizedCallContext' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
  },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Blacklisted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gameId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'card', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'splitHand', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'CardDealt',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'chipsIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'ethUsdPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'ethOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ChipsCashedOut',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'ethIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'ethUsdPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'chipsOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ChipsPurchased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'coordinator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'CoordinatorUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gameId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'dealerTotal',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DealerAction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gameId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'outcome',
        internalType: 'enum Outcome',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'winPercentage',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalPayout',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GameResolved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gameId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'GameStopped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ethIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'chipsMinted',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'HouseFunded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gameId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'action',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'total',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PlayerAction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'priceFeed',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'PriceFeedUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gameId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'requestId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RandomnessRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Registered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RemovedFromBlacklist',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'keyHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'subscriptionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'callbackGasLimit',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'requestConfirmations',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false,
      },
      {
        name: 'nativePayment',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'VrfConfigUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawal',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PRICE_STALENESS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'activeGame',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'blacklist',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_player', internalType: 'address', type: 'address' }],
    name: 'blacklistPlayer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'buyChips',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'chipAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'cashOut',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'chip',
    outputs: [
      { name: '', internalType: 'contract CasinoChip', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'hand', internalType: 'uint8[]', type: 'uint8[]' }],
    name: 'computeHandTotal',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    name: 'doubleBet',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fundHouse',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'gameIdCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'games',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'stage', internalType: 'enum Stage', type: 'uint8' },
      {
        name: 'dealer',
        internalType: 'struct Player',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'balance', internalType: 'uint256', type: 'uint256' },
          { name: 'bet', internalType: 'uint256', type: 'uint256' },
          { name: 'hand', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'splitHand', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'hasSplit', internalType: 'bool', type: 'bool' },
          { name: 'isStanding', internalType: 'bool', type: 'bool' },
        ],
      },
      {
        name: 'player',
        internalType: 'struct Player',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'balance', internalType: 'uint256', type: 'uint256' },
          { name: 'bet', internalType: 'uint256', type: 'uint256' },
          { name: 'hand', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'splitHand', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'hasSplit', internalType: 'bool', type: 'bool' },
          { name: 'isStanding', internalType: 'bool', type: 'bool' },
        ],
      },
      {
        name: 'splitPlayer',
        internalType: 'struct Player',
        type: 'tuple',
        components: [
          { name: 'addr', internalType: 'address', type: 'address' },
          { name: 'balance', internalType: 'uint256', type: 'uint256' },
          { name: 'bet', internalType: 'uint256', type: 'uint256' },
          { name: 'hand', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'splitHand', internalType: 'uint8[]', type: 'uint8[]' },
          { name: 'hasSplit', internalType: 'bool', type: 'bool' },
          { name: 'isStanding', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'currentCardIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'finished', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'uint256', type: 'uint256' },
      { name: 'splitHand', internalType: 'bool', type: 'bool' },
    ],
    name: 'hit',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'vrfCoordinator', internalType: 'address', type: 'address' },
      { name: 'keyHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'subscriptionId', internalType: 'uint256', type: 'uint256' },
      { name: 'chipToken', internalType: 'address', type: 'address' },
      { name: 'ethUsdPriceFeed', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'limitValue',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'bet', internalType: 'uint256', type: 'uint256' }],
    name: 'newGame',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'players',
    outputs: [
      { name: 'addr', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'bet', internalType: 'uint256', type: 'uint256' },
      { name: 'hasSplit', internalType: 'bool', type: 'bool' },
      { name: 'isStanding', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'priceFeed',
    outputs: [
      {
        name: '',
        internalType: 'contract AggregatorV3Interface',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'ethAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'quoteChipsForEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'chipAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'quoteEthForChips',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requestId', internalType: 'uint256', type: 'uint256' },
      { name: 'randomWords', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'register',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_player', internalType: 'address', type: 'address' }],
    name: 'removeFromBlacklist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'requestIdToGameId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_callbackGasLimit',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_keyHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_nativePayment',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_numWords',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_requestConfirmations',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_subscriptionId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_vrfCoordinator',
    outputs: [
      {
        name: '',
        internalType: 'contract IVRFCoordinatorV2Plus',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'vrfCoordinator', internalType: 'address', type: 'address' },
    ],
    name: 'setCoordinator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ethUsdPriceFeed', internalType: 'address', type: 'address' },
    ],
    name: 'setPriceFeed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'keyHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'subscriptionId', internalType: 'uint256', type: 'uint256' },
      { name: 'callbackGasLimit', internalType: 'uint32', type: 'uint32' },
      { name: 'requestConfirmations', internalType: 'uint16', type: 'uint16' },
      { name: 'nativePayment', internalType: 'bool', type: 'bool' },
    ],
    name: 'setVrfConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    name: 'split',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    name: 'stand',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    name: 'stopGame',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'upgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const blackjackAddress = {
  11155111: '0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const blackjackConfig = {
  address: blackjackAddress,
  abi: blackjackAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CasinoChip
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const casinoChipAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'GameAlreadySet' },
  { type: 'error', inputs: [], name: 'NotDeployer' },
  { type: 'error', inputs: [], name: 'OnlyGame' },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'game', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'GameSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deployer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'game',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_game', internalType: 'address', type: 'address' }],
    name: 'setGame',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const casinoChipAddress = {
  11155111: '0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const casinoChipConfig = {
  address: casinoChipAddress,
  abi: casinoChipAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjack = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"PRICE_STALENESS"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackPriceStaleness =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'PRICE_STALENESS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"UPGRADE_INTERFACE_VERSION"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackUpgradeInterfaceVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'UPGRADE_INTERFACE_VERSION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"activeGame"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackActiveGame = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'activeGame',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"blacklist"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackBlacklist = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'blacklist',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"chip"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackChip = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'chip',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"computeHandTotal"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackComputeHandTotal =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'computeHandTotal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"gameIdCounter"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackGameIdCounter =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'gameIdCounter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"games"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackGames = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'games',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"limitValue"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackLimitValue = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'limitValue',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"owner"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackOwner = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"players"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackPlayers = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'players',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"priceFeed"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackPriceFeed = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'priceFeed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"quoteChipsForEth"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackQuoteChipsForEth =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'quoteChipsForEth',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"quoteEthForChips"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackQuoteEthForChips =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'quoteEthForChips',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"requestIdToGameId"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackRequestIdToGameId =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'requestIdToGameId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"s_callbackGasLimit"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackSCallbackGasLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 's_callbackGasLimit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"s_keyHash"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackSKeyHash = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 's_keyHash',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"s_nativePayment"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackSNativePayment =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 's_nativePayment',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"s_numWords"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackSNumWords = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 's_numWords',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"s_requestConfirmations"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackSRequestConfirmations =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 's_requestConfirmations',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"s_subscriptionId"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackSSubscriptionId =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 's_subscriptionId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"s_vrfCoordinator"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useReadBlackjackSVrfCoordinator =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 's_vrfCoordinator',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjack = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"blacklistPlayer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackBlacklistPlayer =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'blacklistPlayer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"buyChips"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackBuyChips = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'buyChips',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"cashOut"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackCashOut = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'cashOut',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"deposit"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"doubleBet"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackDoubleBet = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'doubleBet',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"fundHouse"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackFundHouse = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'fundHouse',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"hit"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackHit = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'hit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"initialize"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: blackjackAbi, address: blackjackAddress, functionName: 'initialize' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"newGame"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackNewGame = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'newGame',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"rawFulfillRandomWords"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackRawFulfillRandomWords =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'rawFulfillRandomWords',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"register"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackRegister = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'register',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"removeFromBlacklist"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackRemoveFromBlacklist =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'removeFromBlacklist',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"setCoordinator"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackSetCoordinator =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'setCoordinator',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackSetPriceFeed =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'setPriceFeed',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"setVrfConfig"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackSetVrfConfig =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'setVrfConfig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"split"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackSplit = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'split',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"stand"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackStand = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'stand',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"stopGame"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackStopGame = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'stopGame',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"upgrade"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackUpgrade = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'upgrade',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWriteBlackjackUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjack = /*#__PURE__*/ createUseSimulateContract({
  abi: blackjackAbi,
  address: blackjackAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"blacklistPlayer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackBlacklistPlayer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'blacklistPlayer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"buyChips"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackBuyChips =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'buyChips',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"cashOut"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackCashOut =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'cashOut',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"deposit"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"doubleBet"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackDoubleBet =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'doubleBet',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"fundHouse"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackFundHouse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'fundHouse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"hit"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackHit = /*#__PURE__*/ createUseSimulateContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'hit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"initialize"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"newGame"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackNewGame =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'newGame',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"rawFulfillRandomWords"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackRawFulfillRandomWords =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'rawFulfillRandomWords',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"register"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackRegister =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'register',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"removeFromBlacklist"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackRemoveFromBlacklist =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'removeFromBlacklist',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"setCoordinator"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackSetCoordinator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'setCoordinator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"setPriceFeed"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackSetPriceFeed =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'setPriceFeed',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"setVrfConfig"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackSetVrfConfig =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'setVrfConfig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"split"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackSplit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'split',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"stand"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackStand =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'stand',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"stopGame"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackStopGame =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'stopGame',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"upgrade"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'upgrade',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useSimulateBlackjackUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: blackjackAbi, address: blackjackAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Blacklisted"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackBlacklistedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'Blacklisted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"CardDealt"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackCardDealtEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'CardDealt',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"ChipsCashedOut"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackChipsCashedOutEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'ChipsCashedOut',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"ChipsPurchased"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackChipsPurchasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'ChipsPurchased',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"CoordinatorUpdated"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackCoordinatorUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'CoordinatorUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"DealerAction"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackDealerActionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'DealerAction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Deposit"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackDepositEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'Deposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"GameResolved"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackGameResolvedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'GameResolved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"GameStopped"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackGameStoppedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'GameStopped',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"HouseFunded"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackHouseFundedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'HouseFunded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Initialized"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"PlayerAction"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackPlayerActionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'PlayerAction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"PriceFeedUpdated"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackPriceFeedUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'PriceFeedUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"RandomnessRequested"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackRandomnessRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'RandomnessRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Registered"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'Registered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"RemovedFromBlacklist"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackRemovedFromBlacklistEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'RemovedFromBlacklist',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Upgraded"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"VrfConfigUpdated"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackVrfConfigUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'VrfConfigUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Withdrawal"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x59D9cAC15818F879DEDe43f9C8Eac319d193FccD)
 */
export const useWatchBlackjackWithdrawalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'Withdrawal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChip = /*#__PURE__*/ createUseReadContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"allowance"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChipAllowance = /*#__PURE__*/ createUseReadContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"balanceOf"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChipBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"decimals"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChipDecimals = /*#__PURE__*/ createUseReadContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"deployer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChipDeployer = /*#__PURE__*/ createUseReadContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'deployer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"game"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChipGame = /*#__PURE__*/ createUseReadContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'game',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"name"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChipName = /*#__PURE__*/ createUseReadContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"symbol"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChipSymbol = /*#__PURE__*/ createUseReadContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"totalSupply"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useReadCasinoChipTotalSupply = /*#__PURE__*/ createUseReadContract(
  {
    abi: casinoChipAbi,
    address: casinoChipAddress,
    functionName: 'totalSupply',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link casinoChipAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWriteCasinoChip = /*#__PURE__*/ createUseWriteContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWriteCasinoChipApprove = /*#__PURE__*/ createUseWriteContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"burn"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWriteCasinoChipBurn = /*#__PURE__*/ createUseWriteContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"mint"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWriteCasinoChipMint = /*#__PURE__*/ createUseWriteContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"setGame"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWriteCasinoChipSetGame = /*#__PURE__*/ createUseWriteContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'setGame',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWriteCasinoChipTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWriteCasinoChipTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link casinoChipAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useSimulateCasinoChip = /*#__PURE__*/ createUseSimulateContract({
  abi: casinoChipAbi,
  address: casinoChipAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useSimulateCasinoChipApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"burn"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useSimulateCasinoChipBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"mint"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useSimulateCasinoChipMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"setGame"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useSimulateCasinoChipSetGame =
  /*#__PURE__*/ createUseSimulateContract({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    functionName: 'setGame',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useSimulateCasinoChipTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link casinoChipAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useSimulateCasinoChipTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link casinoChipAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWatchCasinoChipEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: casinoChipAbi,
    address: casinoChipAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link casinoChipAbi}__ and `eventName` set to `"Approval"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWatchCasinoChipApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link casinoChipAbi}__ and `eventName` set to `"GameSet"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWatchCasinoChipGameSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    eventName: 'GameSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link casinoChipAbi}__ and `eventName` set to `"Transfer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x6A39e7Aa28bF62Fad6f3eCef1beD77C03dD53095)
 */
export const useWatchCasinoChipTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: casinoChipAbi,
    address: casinoChipAddress,
    eventName: 'Transfer',
  })
