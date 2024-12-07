"use client";

import React, { useState } from "react";
import { parseEther } from "viem";
import { sepolia } from "viem/chains";
import { useAccount, useChainId, useConnect, useSwitchChain, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingStakeButtonProps {
  contractAddress: `0x${string}`;
  contractABI: any;
}

const FloatingStakeButton: React.FC<FloatingStakeButtonProps> = ({ contractAddress, contractABI }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<string>("");

  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();

  const handleStake = async () => {
    if (!isConnected) {
      try {
        await connect({ connector: injected() });
        return;
      } catch (err) {
        console.error("Failed to connect wallet:", err);
        return;
      }
    }

    if (currentChainId !== sepolia.id) {
      try {
        await switchChain({ chainId: sepolia.id });
        return;
      } catch (err) {
        console.error("Failed to switch network:", err);
        return;
      }
    }

    try {
      writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "stake",
        args: [],
        value: parseEther(stakeAmount),
      });
    } catch (err) {
      console.error("Error during staking:", err);
    }
  };

  return (
    <div className="fixed bottom-8 left-8">
      <AnimatePresence>
        {!isExpanded ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-16 h-16 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            onClick={() => setIsExpanded(true)}
          >
            <span className="text-2xl">+</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ x: 0, width: "4rem" }}
            animate={{ x: 20, width: "320px" }}
            exit={{ x: 0, width: "4rem" }}
            className="bg-base-100 rounded-lg p-4 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Quick Stake</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="btn btn-circle btn-sm btn-ghost"
                >
                  ×
                </button>
              </div>
              
              <input
                type="text"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Amount in ETH"
                disabled={isPending}
              />

              <button
                onClick={handleStake}
                className={`btn btn-primary w-full ${isPending ? "loading" : ""}`}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isPending}
              >
                {!isConnected ? "Connect Wallet" : isPending ? "Staking..." : "Stake ETH"}
              </button>

              {isSuccess && (
                <div className="alert alert-success text-sm">
                  <span>Successfully staked!</span>
                </div>
              )}

              {isError && (
                <div className="alert alert-error text-sm">
                  <span>{error?.message || "Failed to stake"}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingStakeButton;