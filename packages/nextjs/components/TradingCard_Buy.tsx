// components/TradingCard.tsx
"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

// components/TradingCard.tsx

const TradingCard: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  const [ethAmount, setEthAmount] = useState("0.0");
  const [percentage, setPercentage] = useState("50.0");
  const [longShort, setLongShort] = useState("Long");
  const [period, setPeriod] = useState("7");

  const [selectedCurrency, setSelectedCurrency] = useState("ETH");
  const [outputAmount, setOutputAmount] = useState("0.0");
  const [outputCurrency, setOutputCurrency] = useState("USDC");

  // const [ethPrice, setEthPrice] = useState(null);

  const [selectedLongShortButton, setSelectedLongShortButton] = useState("Long");
  const [selectedPercentageButton, setSelectedPercentageButton] = useState("50.0");
  const [selectedPeriodButton, setSelectedPeriodButton] = useState("30");

  const { connect, connectors } = useConnect({
    connector: new InjectedConnector(),
  });
  const accountData = useAccount();

  // 지갑이 연결되어 있는지 확인
  const isConnected = Boolean(accountData?.address);

  // useEffect(() => {
  //   async function fetchEthPrice() {
  //     try {
  //       const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  //       const data = await response.json();
  //       setEthPrice(data.ethereum.usd);
  //     } catch (error) {
  //       console.error('Error fetching Ethereum price:', error);
  //     }
  //   }

  //   fetchEthPrice();
  // }, []);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(event.target.value);
  };

  const handleOutputCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputCurrency(event.target.value);
  };

  const handleConnectWallet = () => {
    // Add logic to connect the wallet
  };

  const handlePercentageClick = (percentage: string) => {
    // Add logic for calculation here
    console.log(`Adjusting by ${percentage}%`);
    setPercentage(percentage);
    setSelectedPercentageButton(percentage);
    calculateAmount();
  };

  const handleLongShortClick = (type: string) => {
    // Add logic for calculation here
    console.log(`Set Long/Short ${type}%`);
    setLongShort(type);
    setSelectedLongShortButton(type);
    calculateAmount();
  };

  const handlePeriodClick = (period: string) => {
    // Add logic for calculation here
    console.log(`Set period ${period}%`);
    setPeriod(period);
    setSelectedPeriodButton(period);
    calculateAmount();
  };

  const handleEthAmountClick = (amount: string) => {
    // Add logic for calculation here
    console.log(`Set EthAmount ${amount}`);
    setEthAmount(amount);
    calculateAmount();
  };

  const calculateAmount = () => {
    const loadedPercentage = parseFloat(percentage);
    const loadedAmount = parseFloat(ethAmount);
    const loadedPeriod = parseFloat(period);

    if (longShort == "Long") {
      const value = loadedAmount * ((100.0 + loadedPercentage * (loadedPeriod / 365.0)) / 100.0);
      console.log(value.toString());
      setOutputAmount(value.toString());
    } else {
      const value = loadedAmount * ((100.0 - loadedPercentage * (loadedPeriod / 365.0)) / 100.0);
      console.log(value.toString());
      setOutputAmount(value.toString());
    }
    console.log(ethAmount);
    console.log(longShort);
    console.log(percentage);
  };

  const isLongShortSelected = (buttonType: string) => {
    return selectedLongShortButton === buttonType ? "bg-blue-700" : "bg-blue-500";
  };

  const isPercentageSelected = (buttonType: string) => {
    return selectedPercentageButton === buttonType ? "bg-blue-700" : "bg-blue-500";
  };

  const isPeriodSelected = (buttonType: string) => {
    return selectedPeriodButton === buttonType ? "bg-blue-700" : "bg-blue-500";
  };

  return (
    <div className="trading-card">
      <div className="call-section flex justify-center items-center">{/*<button className="">Call</button> */}</div>
      <div className="input-section">
        <div className="w-full bg-gray-300 text-white py-2 rounded grid grid-cols-4 gap-4">
          <input
            type="text"
            value={ethAmount}
            className="bg-gray-300 col-span-3 text-gray-700 text-right font-lg font-bold"
            onChange={e => handleEthAmountClick(e.target.value)}
          />
          <select value={selectedCurrency} onChange={handleCurrencyChange} className="bg-gray-300 text-gray-800">
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <br />
        <div className="types-section grid grid-cols-2 gap-4">
          <button
            className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isLongShortSelected(
              "Long",
            )}`}
            onClick={() => handleLongShortClick("Long")}
          >
            Long
          </button>
          <button
            className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isLongShortSelected(
              "Short",
            )}`}
            onClick={() => handleLongShortClick("Short")}
          >
            Short
          </button>
        </div>
      </div>
      <br />
      <div className="options-section grid grid-cols-5 gap-4">
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPercentageSelected(
            "50.0",
          )}`}
          onClick={() => handlePercentageClick("50.0")}
        >
          +50%
        </button>
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPercentageSelected(
            "40.0",
          )}`}
          onClick={() => handlePercentageClick("40.0")}
        >
          +40%
        </button>
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPercentageSelected(
            "30.0",
          )}`}
          onClick={() => handlePercentageClick("30.0")}
        >
          +30%
        </button>
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPercentageSelected(
            "20.0",
          )}`}
          onClick={() => handlePercentageClick("20.0")}
        >
          +20%
        </button>
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPercentageSelected(
            "10.0",
          )}`}
          onClick={() => handlePercentageClick("10.0")}
        >
          +10%
        </button>
        {/* Add more buttons for each percentage */}
      </div>
      <br />

      <div className="options-section grid grid-cols-4 gap-4">
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPeriodSelected(
            "30",
          )}`}
          onClick={() => handlePeriodClick("30")}
        >
          1 Month
        </button>
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPeriodSelected(
            "60",
          )}`}
          onClick={() => handlePeriodClick("60")}
        >
          2 Months
        </button>
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPeriodSelected(
            "90",
          )}`}
          onClick={() => handlePeriodClick("90")}
        >
          3 Months
        </button>
        <button
          className={`text-white font-bold py-2 px-4 border border-blue-700 hover:bg-blue-700 ${isPeriodSelected(
            "180",
          )}`}
          onClick={() => handlePeriodClick("180")}
        >
          6 Months
        </button>
        {/* Add more buttons for each percentage */}
      </div>

      <br />
      <div className="output-section">
        <div className="w-full bg-gray-300 text-white py-2 rounded grid grid-cols-4 gap-4">
          <span className="bg-gray-300 col-span-3 text-gray-700 text-center font-lg font-bold">
            {/*ethPrice !== null ? (
            <span>${ethPrice} → {`${outputAmount}`}</span>
          ) : (
            <span>Loading... → {`${outputAmount}`}</span>
          )*/}
            ${ethAmount} → {`${outputAmount}`}{" "}
          </span>
          <select value={outputCurrency} onChange={handleOutputCurrencyChange} className="bg-white text-gray-800 mr-2">
            <option value="USDC">USDC</option>
            <option value="ETH">ETH</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
      <br />

      <div className="benefit-section">
        {isConnected ? (
          // 지갑이 연결되어 있으면 Benefit 버튼을 보여줍니다.
          <button className="w-full bg-gray-900 text-white py-2 rounded" onClick={handleConnectWallet}>
            Benefit
          </button>
        ) : (
          // 지갑이 연결되어 있지 않으면 Disconnect 버튼을 보여줍니다.
          <button
            className="w-full bg-orange-500 text-white py-2 rounded"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default TradingCard;
