"use client";

import { useAccount } from "wagmi";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import StakeBalance from "./_components/StakeBalance";
import Streak from "./_components/Streak";
import { StakingABI } from "~~/abis/StakingABI";

const Stake: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const contractAddress = "0x0000000000000000000000000000000000000000";

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Stake Page</span>
        </h1>
        {/* <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress} /> 
        </div>*/}   
        <StakeBalance 
            initialBalance={0.05} 
            contractAddress={contractAddress}
            contractABI={StakingABI}
        /> 
        <Streak />
      </div>
    </div>
  );
};

export default Stake;