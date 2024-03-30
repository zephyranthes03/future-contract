//SPDX-License-Identifier: MIT

 pragma solidity 0.8.17;
//  import "@openzeppelin/contracts/utils/math/SafeMath.sol";
 import "./FutureOption.sol";

/**
Chain link price feed link
https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
 */

/**
 * @author 0mllwntrmt3
 * @title ETH Call Options
 * @notice ETH Call Options Contract
 */
contract FutureCallOptions is FutureOptions {
    using SafeMath for uint256;
    FutureETHPool public pool;

    /**
     * @param _priceProvider The address of ChainLink ETH/USD price feed contract
     */
    constructor(AggregatorInterface _priceProvider) 
        public
        FutureOptions(_priceProvider, OptionType.Call)
    {
        pool = new FutureETHPool();
    }

    /**
     * @notice Can be used to update the contract in critical situations in the first 90 days after deployment
     */
    function transferPoolOwnership() external onlyOwner {
        require(block.timestamp < contractCreationTimestamp + 90 days);
        pool.transferOwnership(owner());
    }

    /**
     * @notice Used for changing the lockup period
     * @param value New period value
     */
    function setLockupPeriod(uint256 value) external onlyOwner {
        require(value <= 60 days, "Lockup period is too large");
        pool.setLockupPeriod(value);
    }

    /**
     * @notice Sends premiums to the ETH liquidity pool contract
     * @param amount The amount of premiums that will be sent to the pool
     */
    function sendPremium(uint amount) internal override returns (uint locked) {
        pool.sendPremium {value: amount}();
        locked = amount;
    }

    /**
     * @notice Locks the amount required for an option
     * @param option A specific option contract
     */
    function lockFunds(Option memory option) internal override {
        pool.lock(option.amount);
    }

    /**
     * @notice Sends profits in ETH from the ETH pool to a call option holder's address
     * @param option A specific option contract
     */
    function payProfit(Option memory option)
        internal
        override
        returns (uint profit)
    {
        uint currentPrice = uint(priceProvider.latestAnswer());
        require(option.strike <= currentPrice, "Current price is too low");
        profit = currentPrice.sub(option.strike).mul(option.amount).div(currentPrice);
        pool.send(option.holder, profit);
        unlockFunds(option);
    }

    /**
     * @notice Unlocks the amount that was locked in a call option contract
     * @param option A specific option contract
     */
    function unlockFunds(Option memory option) internal override {
        pool.unlockPremium(option.premium);
        pool.unlock(option.amount);
    }
}