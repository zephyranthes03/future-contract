//SPDX-License-Identifier: MIT

 pragma solidity 0.8.17;
 import "./Interfaces.sol";
 import "./FutureOption.sol";
 import "./FutureERCPool.sol";


/**
 * @author 0mllwntrmt3
 * @title block.timestamp ETH Put Options
 * @notice ETH Put Options Contract
 */
contract FuturePutOptions is FutureOptions {
    using SafeMath for uint256;

    IUniswapV2Router01 public uniswapRouter;
    FutureERCPool public pool;
    uint256 public maxSpread = 95;
    IERC20 internal token;

    /**
     * @param _token The address of stable ERC20 token contract
     * @param _priceProvider The address of ChainLink ETH/USD price feed contract
     * @param _uniswapRouter The address of Uniswap Router contract
     */
    constructor(
        IERC20 _token,
        AggregatorInterface _priceProvider,
        IUniswapV2Router01 _uniswapRouter
    )
        public
        FutureOptions(_priceProvider, OptionType.Put)
    {
        token = _token;
        uniswapRouter = _uniswapRouter;
        pool = new FutureERCPool(token);
        approve();
    }

    /**
     * @notice Can be used to update the contract in critical situations
     *         in the first 90 days after deployment
     */
    function transferPoolOwnership() external onlyOwner {
        require(block.timestamp < contractCreationTimestamp + 90 days);
        pool.transferOwnership(owner());
    }

    /**
     * @notice Used for adjusting the spread limit
     * @param value New maxSpread value
     */
    function setMaxSpread(uint256 value) external onlyOwner {
        require(value <= 95, "Spread limit is too small");
        maxSpread = value;
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
     * @notice Allows the ERC pool contract to receive and send tokens
     */
    function approve() public {
        require(
            token.approve(address(pool), type(uint).max),
            "token approve failed"
        );
    }

    /**
     * @notice Sends premiums to the ERC liquidity pool contract
     */
    function sendPremium(uint256 amount) internal override returns (uint premium) {
        uint currentPrice = uint(priceProvider.latestAnswer());
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = address(token);
        uint[] memory amounts = uniswapRouter.swapExactETHForTokens {
            value: amount
        }(
            amount.mul(currentPrice).mul(maxSpread).div(1e10),
            path,
            address(this),
            block.timestamp
        );
        premium = amounts[amounts.length - 1];
        pool.sendPremium(premium);
    }

    /**
     * @notice Locks the amount required for an option
     * @param option A specific option contract
     */
    function lockFunds(Option memory option) internal override {
        pool.lock(option.amount.mul(option.strike).div(PRICE_DECIMALS));
    }

    /**
     * @notice Sends profits in DAI from the ERC pool to a put option holder's address
     * @param option A specific option contract
     */
    function payProfit(Option memory option) internal override returns (uint profit) {
        uint currentPrice = uint(priceProvider.latestAnswer());
        require(option.strike >= currentPrice, "Current price is too high");
        profit = option.strike.sub(currentPrice).mul(option.amount).div(PRICE_DECIMALS);
        pool.send(option.holder, profit);
        unlockFunds(option);
    }

    /**
     * @notice Unlocks the amount that was locked in a put option contract
     * @param option A specific option contract
     */
    function unlockFunds(Option memory option) internal override {
        pool.unlockPremium(option.premium);
        pool.unlock(option.amount.mul(option.strike).div(PRICE_DECIMALS));
    }
}