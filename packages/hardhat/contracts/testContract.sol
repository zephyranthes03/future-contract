//SPDX-License-Identifier: MIT

 pragma solidity 0.8.17;

 import "./Interfaces.sol";


contract FakeExchange {
    AggregatorInterface price;

    uint256 public spread = 99;
    address public WETH = address(this);

    constructor(AggregatorInterface pp, FakeUSD t) public {
        price = pp;
        token = t;
    }

    receive() external payable {}

    FakeUSD token;

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256
    ) external payable returns (uint256[] memory amounts) {
        require(path[0] == WETH, "UniswapV2Router: INVALID_PATH");
        uint256 amount = getEthToTokenInputPrice(msg.value);
        require(amount >= amountOutMin, "Spread is too high");
        token.mintTo(to, amount);
        amounts = new uint256[](path.length);
        amounts[0] = msg.value;
        amounts[path.length - 1] = amount;
    }

    function getTokenToEthInputPrice(uint256 tokens_sold)
        public
        view
        returns (uint256 eth_bought)
    {
        eth_bought =
            ((tokens_sold * 1e6) / uint256(price.latestAnswer())) *
            spread;
    }

    function getEthToTokenInputPrice(uint256 eth_sold)
        public
        view
        returns (uint256 tokens_bought)
    {
        tokens_bought =
            (eth_sold * uint256(price.latestAnswer()) * spread) /
            1e10;
    }

    function withdrow() public {
        payable(msg.sender).transfer(address(this).balance);
    }
}


contract FakePriceProvider {
    uint256 public price;

    constructor(uint256 p) public {
        price = p;
    }

    function latestAnswer() external view returns (uint256) {
        return price;
    }

    function setPrice(uint256 _price) public {
        price = _price;
    }
}


contract FakeUSD is ERC20("FakeUSD", "FAKE") {
    function mintTo(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}