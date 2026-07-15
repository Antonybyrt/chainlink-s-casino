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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
  { type: 'error', inputs: [], name: 'ExceededLimit' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'GameAlreadyInProgress' },
  { type: 'error', inputs: [], name: 'GameFinished' },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'InsufficientBalanceToDouble' },
  { type: 'error', inputs: [], name: 'InsufficientBalanceToSplit' },
  { type: 'error', inputs: [], name: 'InvalidBet' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NoFundsSent' },
  { type: 'error', inputs: [], name: 'NotAllowed' },
  { type: 'error', inputs: [], name: 'NotEnoughCardsForSplit' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotRegistered' },
  { type: 'error', inputs: [], name: 'NotYourGame' },
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
  { type: 'error', inputs: [], name: 'SplitOnlyAllowedWith2Cards' },
  { type: 'error', inputs: [], name: 'TransferFailed' },
  { type: 'error', inputs: [], name: 'UUPSUnauthorizedCallContext' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
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
    inputs: [],
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
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'playerWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const blackjackAddress = {
  128123: '0xC24247598931F544fceC7e4929bff09567012183',
} as const

/**
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const blackjackConfig = {
  address: blackjackAddress,
  abi: blackjackAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useReadBlackjack = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"UPGRADE_INTERFACE_VERSION"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useReadBlackjackActiveGame = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'activeGame',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"blacklist"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useReadBlackjackBlacklist = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'blacklist',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"computeHandTotal"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useReadBlackjackGames = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'games',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"limitValue"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useReadBlackjackLimitValue = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'limitValue',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"owner"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useReadBlackjackOwner = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"players"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useReadBlackjackPlayers = /*#__PURE__*/ createUseReadContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'players',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useReadBlackjackProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjack = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"blacklistPlayer"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackBlacklistPlayer =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'blacklistPlayer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"deposit"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"doubleBet"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackDoubleBet = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'doubleBet',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"hit"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackHit = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'hit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"initialize"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: blackjackAbi, address: blackjackAddress, functionName: 'initialize' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"newGame"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackNewGame = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'newGame',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"playerWithdraw"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackPlayerWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'playerWithdraw',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"register"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackRegister = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'register',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"removeFromBlacklist"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"split"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackSplit = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'split',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"stand"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackStand = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'stand',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"stopGame"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackStopGame = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'stopGame',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWriteBlackjackUpgrade = /*#__PURE__*/ createUseWriteContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'upgrade',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useSimulateBlackjack = /*#__PURE__*/ createUseSimulateContract({
  abi: blackjackAbi,
  address: blackjackAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"blacklistPlayer"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useSimulateBlackjackBlacklistPlayer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'blacklistPlayer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"deposit"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useSimulateBlackjackDoubleBet =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'doubleBet',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"hit"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useSimulateBlackjackHit = /*#__PURE__*/ createUseSimulateContract({
  abi: blackjackAbi,
  address: blackjackAddress,
  functionName: 'hit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"initialize"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useSimulateBlackjackNewGame =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'newGame',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"playerWithdraw"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useSimulateBlackjackPlayerWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'playerWithdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"register"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useSimulateBlackjackRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: blackjackAbi,
    address: blackjackAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link blackjackAbi}__ and `functionName` set to `"split"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWatchBlackjackEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: blackjackAbi, address: blackjackAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Blacklisted"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWatchBlackjackCardDealtEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'CardDealt',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"DealerAction"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWatchBlackjackGameStoppedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'GameStopped',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Initialized"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWatchBlackjackPlayerActionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'PlayerAction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Registered"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
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
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWatchBlackjackUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link blackjackAbi}__ and `eventName` set to `"Withdrawal"`
 *
 * [__View Contract on Etherlink Testnet Etherlink Testnet__](https://testnet.explorer.etherlink.com/address/0xC24247598931F544fceC7e4929bff09567012183)
 */
export const useWatchBlackjackWithdrawalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: blackjackAbi,
    address: blackjackAddress,
    eventName: 'Withdrawal',
  })
