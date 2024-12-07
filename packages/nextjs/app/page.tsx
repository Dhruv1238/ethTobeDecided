"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PanInfo, motion, useMotionValue, useTransform } from "framer-motion";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { StakingABI } from "~~/abis/StakingABI";
import StakeCard from "~~/components/StakeCard";
import StatsComponent from "~~/components/StatsComponent";
import StepComponent from "~~/components/StepComponent";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const router = useRouter();
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const { address: connectedAddress } = useAccount();
  const contractAddress = "0x52dE6508FECCA4d712b75b0bD018a621EaF2d734" as `0x${string}`;
  const contractABI = StakingABI;

  const bgOpacity = useTransform(y, [0, 150], [0, isDragging ? 0.7 : 0.5]);

  const handleDrag = (_: any, info: PanInfo) => {
    if (info.offset.y > 150) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 150) {
      y.set(window.innerHeight);
      setTimeout(() => {
        router.push("/leaderboard");
      }, 300);
    } else {
      y.set(0);
    }
  };

  return (
    <>
      <motion.div
        style={{
          opacity: bgOpacity,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "black",
          pointerEvents: "none",
          zIndex: 40,
        }}
      />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.9}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="flex items-center flex-col flex-grow pt-10"
      >
        <motion.div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: useTransform(y, [0, 50], [0, 1]),
            zIndex: 50,
          }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-neon-green"
          >
            ↓
          </motion.div>
          <span className="text-neon-green font-bold bg-base-300 px-4 py-2 rounded-full shadow-lg">
            Pull down for Leaderboard
          </span>
        </motion.div>

        <div className="mb-8 text-center text-sm text-gray-400 animate-pulse">
          Swipe down to check the leaderboard rankings
        </div>

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
            <StatsComponent stepsGoal={6000} />
          </div>

          <div className="flex justify-center my-4">
            <StepComponent totalSteps={6000} />
          </div>

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
              <div className="absolute -left-4 top-1/2 animate-pulse"></div>
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
      </motion.div>
    </>
  );
};

export default Home;
