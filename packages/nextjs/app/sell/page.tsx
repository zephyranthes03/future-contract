// pages/index.tsx
import TradingCard from "../../components/TradingCard_Sell";
import type { NextPage } from "next";

const Contract: NextPage = () => {
  return (
    <div>
      <br />
      <br />
      <div className="rounded-sm border border-gray-30 w-1/5 mx-auto my-2 p-2 text-2xl text-center">Sell</div>

      <div className="rounded-lg border border-gray-30 w-2/5 mx-auto my-8 p-8">
        <TradingCard />
      </div>
    </div>
  );
};

export default Contract;
