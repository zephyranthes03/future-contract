// pages/index.tsx
import TradingCard from "../../components/TradingCard";
import type { NextPage } from "next";

const Contract: NextPage = () => {
  return (
    <div className="rounded-lg border border-gray-30 w-2/5 mx-auto my-8 p-8">
      <TradingCard />
    </div>
  );
};

export default Contract;
