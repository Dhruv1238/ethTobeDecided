"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { StakingABI } from "~~/abis/StakingABI";
import StakeButton from "~~/components/StakeButton";
import StakeCard from "~~/components/StakeCard";
import StatsComponent from "~~/components/StatsComponent";
import StepComponent from "~~/components/StepComponent";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const contractAddress = "0x0000000000000000000000000000000000000000" as `0x${string}`;
  const contractABI = StakingABI;

  return (
    <>
      {/* Floating Stake Button - Always visible */}
      {/* <div className="fixed right-0 bottom-8 z-50 flex items-center">
        <StakeButton contractAddress={contractAddress} contractABI={contractABI} />
      </div> */}

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
            <StatsComponent stepsGoal={8000} />
          </div>

          <div className="flex justify-center my-4">
            <StepComponent totalSteps={8000} />
          </div>

          {/* Stake Card with CTA Arrow */}
          <div className="relative">
            <div className="absolute -top-12 right-10 animate-bounce">
              <div className="flex items-center text-neon-green">
                <span className="mr-2 font-bold">Stake Now!</span>
                <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-1/2 animate-pulse">
                {/* <div className="flex items-center text-neon-green rotate-[-30deg]">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div> */}
              </div>
              <StakeCard contractAddress={contractAddress} contractABI={contractABI} />
            </div>
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
