import { ContractBase } from '../abi.support.js'
import { MAX_UINT, _totalSupply, allowance, allowed, balanceOf, balances, basisPointsRate, decimals, deprecated, getBlackListStatus, getOwner, isBlackListed, maximumFee, name, owner, paused, symbol, totalSupply, upgradedAddress } from './functions.js'
import type { AllowanceParams, AllowedParams, BalanceOfParams, BalancesParams, GetBlackListStatusParams, IsBlackListedParams } from './functions.js'

export class Contract extends ContractBase {
    name() {
        return this.eth_call(name, {})
    }

    deprecated() {
        return this.eth_call(deprecated, {})
    }

    totalSupply() {
        return this.eth_call(totalSupply, {})
    }

    upgradedAddress() {
        return this.eth_call(upgradedAddress, {})
    }

    balances(_0: BalancesParams["_0"]) {
        return this.eth_call(balances, {_0})
    }

    decimals() {
        return this.eth_call(decimals, {})
    }

    maximumFee() {
        return this.eth_call(maximumFee, {})
    }

    _totalSupply() {
        return this.eth_call(_totalSupply, {})
    }

    getBlackListStatus(_maker: GetBlackListStatusParams["_maker"]) {
        return this.eth_call(getBlackListStatus, {_maker})
    }

    allowed(_0: AllowedParams["_0"], _1: AllowedParams["_1"]) {
        return this.eth_call(allowed, {_0, _1})
    }

    paused() {
        return this.eth_call(paused, {})
    }

    balanceOf(who: BalanceOfParams["who"]) {
        return this.eth_call(balanceOf, {who})
    }

    getOwner() {
        return this.eth_call(getOwner, {})
    }

    owner() {
        return this.eth_call(owner, {})
    }

    symbol() {
        return this.eth_call(symbol, {})
    }

    allowance(_owner: AllowanceParams["_owner"], _spender: AllowanceParams["_spender"]) {
        return this.eth_call(allowance, {_owner, _spender})
    }

    basisPointsRate() {
        return this.eth_call(basisPointsRate, {})
    }

    isBlackListed(_0: IsBlackListedParams["_0"]) {
        return this.eth_call(isBlackListed, {_0})
    }

    MAX_UINT() {
        return this.eth_call(MAX_UINT, {})
    }
}
