"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import StatsComponent from "~~/components/StatsComponent";
import StepComponent from "~~/components/StepComponent";
import { Address } from "~~/components/scaffold-eth";
import StakeButton from "~~/components/StakeButton";
import { StakingABI } from "~~/abis/StakingABI";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const contractAddress = "0x0000000000000000000000000000000000000000" as `0x${string}`;
  const contractABI = StakingABI;
  
  return (
    <>
      {/* Floating Stake Button - Always visible */}
      <div className="fixed right-0 bottom-8 z-50 flex items-center">
        <StakeButton contractAddress={contractAddress} contractABI={contractABI} />
      </div>

      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">
              Welcome to
              <span className="text-4xl font-bold ml-2">StakeFIT</span>
            </span>
            <>
              <span className="text-2xl"> Stake </span>
              <span className="text-4xl font-bold text-accent">your Health</span>
            </>
          </h1>

          <div className="flex justify-center my-4">
            <StepComponent currentSteps={2000} totalSteps={6000} />
          </div>
          
          <div className="flex justify-center my-4">
            <StatsComponent steps={2259} minutes={23} calories={68} stepsGoal={6000} />
          </div>  

          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;