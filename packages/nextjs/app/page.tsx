"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PanInfo, motion, useMotionValue, useTransform } from "framer-motion";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
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
      {/* Background Overlay */}
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

      {/* Main Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.9}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="flex items-center flex-col flex-grow pt-10"
      >
        {/* Pull Down Indicator */}
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
            className="text-[#11ce6f]"
          >
            ↓
          </motion.div>
          <span className="text-[#11ce6f] font-bold bg-[#2d2c2e] px-4 py-2 rounded-full shadow-lg">
            Pull down for Leaderboard
          </span>
        </motion.div>

        <div className="mb-8 text-center text-sm text-[#a3a2a7] animate-pulse">
          Swipe down to check the leaderboard rankings
        </div>

        <div className="px-5 max-w-4xl w-full">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold mb-2 bg-gradient-to-r from-[#11ce6f] to-[#3b82f6] text-transparent bg-clip-text">
              Welcome to Momentum
            </span>
            <span className="text-xl text-[#a3a2a7]">
              Stake your steps, earn rewards
            </span>
          </h1>

          {/* Stats Section */}
          <div className="space-y-4 mb-8">
            <StatsComponent stepsGoal={8000} />
            <StepComponent totalSteps={8000} />
          </div>

          {/* Stake Card Section */}
          <div className="relative mb-8">
            <div className="absolute -top-12 right-10 animate-bounce">
              <div className="flex items-center text-[#11ce6f]">
                <span className="mr-2 font-bold">Stake Now!</span>
                <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <StakeCard contractAddress={contractAddress} contractABI={contractABI} />
          </div>

          {/* Connected Address */}
          {connectedAddress && (
            <div className="flex justify-center items-center gap-2 mb-8">
              <span className="text-[#a3a2a7]">Connected:</span>
              <Address address={connectedAddress} />
            </div>
          )}

          {/* Footer Links */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <Link 
              href="/debug" 
              className="p-6 rounded-xl bg-[#2d2c2e] hover:bg-[#3d3c3e] transition-colors text-center"
            >
              <h3 className="text-lg font-semibold mb-2">Debug Contracts</h3>
              <p className="text-[#a3a2a7]">Test and debug your smart contracts</p>
            </Link>
            
            <Link 
              href="/blockexplorer" 
              className="p-6 rounded-xl bg-[#2d2c2e] hover:bg-[#3d3c3e] transition-colors text-center"
            >
              <h3 className="text-lg font-semibold mb-2">Block Explorer</h3>
              <p className="text-[#a3a2a7]">View transaction history and contract interactions</p>
            </Link>
          </div> */}
        </div>
      </motion.div>
    </>
  );
};

export default Home;