import { address, bool, string, uint256 } from '@subsquid/evm-codec'
import { func } from '../abi.support.js'
import type { FunctionArguments, FunctionReturn } from '../abi.support.js'

/** name() */
export const name = func('0x06fdde03', {}, string)
export type NameParams = FunctionArguments<typeof name>
export type NameReturn = FunctionReturn<typeof name>

/** deprecate(address) */
export const deprecate = func('0x0753c30c', {
    _upgradedAddress: address,
})
export type DeprecateParams = FunctionArguments<typeof deprecate>
export type DeprecateReturn = FunctionReturn<typeof deprecate>

/** approve(address,uint256) */
export const approve = func('0x095ea7b3', {
    _spender: address,
    _value: uint256,
})
export type ApproveParams = FunctionArguments<typeof approve>
export type ApproveReturn = FunctionReturn<typeof approve>

/** deprecated() */
export const deprecated = func('0x0e136b19', {}, bool)
export type DeprecatedParams = FunctionArguments<typeof deprecated>
export type DeprecatedReturn = FunctionReturn<typeof deprecated>

/** addBlackList(address) */
export const addBlackList = func('0x0ecb93c0', {
    _evilUser: address,
})
export type AddBlackListParams = FunctionArguments<typeof addBlackList>
export type AddBlackListReturn = FunctionReturn<typeof addBlackList>

/** totalSupply() */
export const totalSupply = func('0x18160ddd', {}, uint256)
export type TotalSupplyParams = FunctionArguments<typeof totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof totalSupply>

/** transferFrom(address,address,uint256) */
export const transferFrom = func('0x23b872dd', {
    _from: address,
    _to: address,
    _value: uint256,
})
export type TransferFromParams = FunctionArguments<typeof transferFrom>
export type TransferFromReturn = FunctionReturn<typeof transferFrom>

/** upgradedAddress() */
export const upgradedAddress = func('0x26976e3f', {}, address)
export type UpgradedAddressParams = FunctionArguments<typeof upgradedAddress>
export type UpgradedAddressReturn = FunctionReturn<typeof upgradedAddress>

/** balances(address) */
export const balances = func('0x27e235e3', {
    _0: address,
}, uint256)
export type BalancesParams = FunctionArguments<typeof balances>
export type BalancesReturn = FunctionReturn<typeof balances>

/** decimals() */
export const decimals = func('0x313ce567', {}, uint256)
export type DecimalsParams = FunctionArguments<typeof decimals>
export type DecimalsReturn = FunctionReturn<typeof decimals>

/** maximumFee() */
export const maximumFee = func('0x35390714', {}, uint256)
export type MaximumFeeParams = FunctionArguments<typeof maximumFee>
export type MaximumFeeReturn = FunctionReturn<typeof maximumFee>

/** _totalSupply() */
export const _totalSupply = func('0x3eaaf86b', {}, uint256)
export type _totalSupplyParams = FunctionArguments<typeof _totalSupply>
export type _totalSupplyReturn = FunctionReturn<typeof _totalSupply>

/** unpause() */
export const unpause = func('0x3f4ba83a', {})
export type UnpauseParams = FunctionArguments<typeof unpause>
export type UnpauseReturn = FunctionReturn<typeof unpause>

/** getBlackListStatus(address) */
export const getBlackListStatus = func('0x59bf1abe', {
    _maker: address,
}, bool)
export type GetBlackListStatusParams = FunctionArguments<typeof getBlackListStatus>
export type GetBlackListStatusReturn = FunctionReturn<typeof getBlackListStatus>

/** allowed(address,address) */
export const allowed = func('0x5c658165', {
    _0: address,
    _1: address,
}, uint256)
export type AllowedParams = FunctionArguments<typeof allowed>
export type AllowedReturn = FunctionReturn<typeof allowed>

/** paused() */
export const paused = func('0x5c975abb', {}, bool)
export type PausedParams = FunctionArguments<typeof paused>
export type PausedReturn = FunctionReturn<typeof paused>

/** balanceOf(address) */
export const balanceOf = func('0x70a08231', {
    who: address,
}, uint256)
export type BalanceOfParams = FunctionArguments<typeof balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof balanceOf>

/** pause() */
export const pause = func('0x8456cb59', {})
export type PauseParams = FunctionArguments<typeof pause>
export type PauseReturn = FunctionReturn<typeof pause>

/** getOwner() */
export const getOwner = func('0x893d20e8', {}, address)
export type GetOwnerParams = FunctionArguments<typeof getOwner>
export type GetOwnerReturn = FunctionReturn<typeof getOwner>

/** owner() */
export const owner = func('0x8da5cb5b', {}, address)
export type OwnerParams = FunctionArguments<typeof owner>
export type OwnerReturn = FunctionReturn<typeof owner>

/** symbol() */
export const symbol = func('0x95d89b41', {}, string)
export type SymbolParams = FunctionArguments<typeof symbol>
export type SymbolReturn = FunctionReturn<typeof symbol>

/** transfer(address,uint256) */
export const transfer = func('0xa9059cbb', {
    _to: address,
    _value: uint256,
})
export type TransferParams = FunctionArguments<typeof transfer>
export type TransferReturn = FunctionReturn<typeof transfer>

/** setParams(uint256,uint256) */
export const setParams = func('0xc0324c77', {
    newBasisPoints: uint256,
    newMaxFee: uint256,
})
export type SetParamsParams = FunctionArguments<typeof setParams>
export type SetParamsReturn = FunctionReturn<typeof setParams>

/** issue(uint256) */
export const issue = func('0xcc872b66', {
    amount: uint256,
})
export type IssueParams = FunctionArguments<typeof issue>
export type IssueReturn = FunctionReturn<typeof issue>

/** redeem(uint256) */
export const redeem = func('0xdb006a75', {
    amount: uint256,
})
export type RedeemParams = FunctionArguments<typeof redeem>
export type RedeemReturn = FunctionReturn<typeof redeem>

/** allowance(address,address) */
export const allowance = func('0xdd62ed3e', {
    _owner: address,
    _spender: address,
}, uint256)
export type AllowanceParams = FunctionArguments<typeof allowance>
export type AllowanceReturn = FunctionReturn<typeof allowance>

/** basisPointsRate() */
export const basisPointsRate = func('0xdd644f72', {}, uint256)
export type BasisPointsRateParams = FunctionArguments<typeof basisPointsRate>
export type BasisPointsRateReturn = FunctionReturn<typeof basisPointsRate>

/** isBlackListed(address) */
export const isBlackListed = func('0xe47d6060', {
    _0: address,
}, bool)
export type IsBlackListedParams = FunctionArguments<typeof isBlackListed>
export type IsBlackListedReturn = FunctionReturn<typeof isBlackListed>

/** removeBlackList(address) */
export const removeBlackList = func('0xe4997dc5', {
    _clearedUser: address,
})
export type RemoveBlackListParams = FunctionArguments<typeof removeBlackList>
export type RemoveBlackListReturn = FunctionReturn<typeof removeBlackList>

/** MAX_UINT() */
export const MAX_UINT = func('0xe5b5019a', {}, uint256)
export type MAX_UINTParams = FunctionArguments<typeof MAX_UINT>
export type MAX_UINTReturn = FunctionReturn<typeof MAX_UINT>

/** transferOwnership(address) */
export const transferOwnership = func('0xf2fde38b', {
    newOwner: address,
})
export type TransferOwnershipParams = FunctionArguments<typeof transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof transferOwnership>

/** destroyBlackFunds(address) */
export const destroyBlackFunds = func('0xf3bdc228', {
    _blackListedUser: address,
})
export type DestroyBlackFundsParams = FunctionArguments<typeof destroyBlackFunds>
export type DestroyBlackFundsReturn = FunctionReturn<typeof destroyBlackFunds>
