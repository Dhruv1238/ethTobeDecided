"use client";

import { StakingABI } from "../../abis/StakingABI";
import StakeBalance from "./_components/StakeBalance";
import Streak from "./_components/Streak";
import type { NextPage } from "next";

const Stake: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Stake Page</span>
        </h1>
        <StakeBalance
          initialBalance={0}
          contractAddress="0xaa27BB10f64c37FeA832D4218fE37D904e2a3911"
          contractABI={StakingABI}
          chainId={11155111}
        />
        <Streak />
      </div>
    </div>
  );
};

export default Stake;
