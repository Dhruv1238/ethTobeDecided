"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PanInfo, motion, useMotionValue, useTransform } from "framer-motion";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { StakingABI } from "~~/abis/StakingABI";
import ChatSearchBar from "~~/components/ChatSearchBar";
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
    setIsDragging(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Overlay */}
      <motion.div
        style={{
          opacity: bgOpacity,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95))",
          pointerEvents: "none",
          zIndex: 40,
        }}
      />

      {/* Scrollable Container */}
      <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-[#1a1a1a] to-[#000001]">
        {/* Draggable Header Section */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{ y }}
          className="w-full"
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
              className="text-[#11ce6f] text-2xl"
            >
              ↓
            </motion.div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-[#11ce6f] font-bold bg-[#2d2c2e] px-6 py-3 rounded-full
                       shadow-[0_0_15px_rgba(17,206,111,0.2)] border border-[#11ce6f33]
                       backdrop-blur-lg"
            >
              Pull down for Leaderboard
            </motion.span>
          </motion.div>

          {/* Logo and Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 pt-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative inline-block"
            >
              <Image
                src="/logo.png"
                alt="StakeFit Logo"
                width={120}
                height={120}
                className="mx-auto mb-4 drop-shadow-[0_0_15px_rgba(17,206,111,0.2)]"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#11ce6f20] to-transparent"
              />
            </motion.div>
            <h1 className="text-center mb-4">
              <span className="block text-4xl font-bold mb-2 bg-gradient-to-r from-[#11ce6f] to-[#3b82f6] text-transparent bg-clip-text">
                Welcome to StakeFit
              </span>
              <span className="text-xl text-[#a3a2a7]">
                A Bet on your Fitness
              </span>
            </h1>
          </motion.div>
        </motion.div>

        {/* Regular Scrollable Content */}
        <div className="px-5 max-w-4xl w-full mx-auto relative z-10">
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            <StatsComponent stepsGoal={8000} />
            <StepComponent totalSteps={8000} />
          </motion.div>

          {/* Stake Card Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative mb-8"
          >
            <div className="backdrop-blur-lg bg-opacity-80">
              <StakeCard contractAddress={contractAddress} contractABI={contractABI} />
            </div>
          </motion.div>

          {/* Connected Address */}
          {connectedAddress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center gap-2 mb-8 bg-[#2d2c2e] px-6 py-3 rounded-full
                         shadow-[0_0_15px_rgba(17,206,111,0.1)] border border-[#11ce6f33]"
            >
              <span className="text-[#a3a2a7]">Connected:</span>
              <Address address={connectedAddress} />
            </motion.div>
          )}

          {/* Additional Content Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 space-y-8 mb-24"
          >
            {/* How It Works */}
            <div className="bg-[#2d2c2e] rounded-xl p-6 border border-[#11ce6f33]">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#11ce6f] to-[#3b82f6] text-transparent bg-clip-text">
                How StakeFit Works
              </h2>
              <div className="space-y-4 text-[#a3a2a7]">
                <p>1. Connect your wallet and stake ETH</p>
                <p>2. Complete your daily step goals</p>
                <p>3. Earn rewards for staying active</p>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-[#2d2c2e] rounded-xl p-6 border border-[#11ce6f33]">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#11ce6f] to-[#3b82f6] text-transparent bg-clip-text">
                Fitness Tips
              </h2>
              <div className="space-y-4 text-[#a3a2a7]">
                <p>• Stay consistent with your daily steps</p>
                <p>• Set achievable goals</p>
                <p>• Track your progress regularly</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ChatSearchBar - Fixed on top */}
      <div className="fixed bottom-0 left-0 right-0 z-[60]">
        <ChatSearchBar />
      </div>
    </div>
  );
};

export default Home;