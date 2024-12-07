"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { parseEther } from "viem";
import { baseSepolia } from "viem/chains";
// Changed to baseSepolia
import { useAccount, useBalance, useChainId, useConnect, useSwitchChain, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";

interface FloatingStakeButtonProps {
  contractAddress: `0x${string}`;
  contractABI: any;
}

const FloatingStakeButton: React.FC<FloatingStakeButtonProps> = ({ contractAddress, contractABI }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [networkError, setNetworkError] = useState<string>("");

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();

  // Define Base Sepolia chain if not available in viem
  const BASE_SEPOLIA = {
    id: 84532,
    name: "Base Sepolia",
    network: "base-sepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Base Sepolia Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      default: { http: ["https://sepolia.base.org"] },
      public: { http: ["https://sepolia.base.org"] },
    },
    blockExplorers: {
      default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
    },
    testnet: true,
  };

  // Get user's Base Sepolia ETH balance
  const { data: balance } = useBalance({
    address,
    chainId: BASE_SEPOLIA.id,
  });

  // Check and handle network on component mount and when chain changes
  useEffect(() => {
    if (isConnected && currentChainId !== BASE_SEPOLIA.id) {
      setNetworkError("Please switch to Base Sepolia network");
    } else {
      setNetworkError("");
    }
  }, [currentChainId, isConnected]);

  const handleNetworkSwitch = async () => {
    try {
      await switchChain({ chainId: BASE_SEPOLIA.id });
    } catch (err) {
      console.error("Failed to switch network:", err);
      setNetworkError("Failed to switch network. Please add Base Sepolia network manually.");
    }
  };

  const handleStake = async () => {
    try {
      // Connect wallet if not connected
      if (!isConnected) {
        await connect({ connector: injected() });
        return;
      }

      // Ensure we're on Base Sepolia
      if (currentChainId !== BASE_SEPOLIA.id) {
        await handleNetworkSwitch();
        return;
      }

      // Validate amount
      const amount = parseFloat(stakeAmount);
      if (!amount || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Check if user has enough balance
      const stakeAmountWei = parseEther(stakeAmount);
      if (balance && stakeAmountWei > balance.value) {
        throw new Error("Insufficient Base Sepolia ETH balance");
      }

      // Execute stake transaction
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "stake",
        args: [],
        value: stakeAmountWei,
      });
    } catch (err: any) {
      console.error("Staking error:", err);
      setNetworkError(err.message || "Failed to stake");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setStakeAmount(value);
    }
  };

  return (
    <div className="fixed bottom-24 right-4">
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
            animate={{ x: -20, width: "320px" }}
            exit={{ x: 0, width: "4rem" }}
            className="bg-base-100 rounded-lg p-4 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Stake on Base Sepolia</h3>
                <button onClick={() => setIsExpanded(false)} className="btn btn-circle btn-sm btn-ghost">
                  ×
                </button>
              </div>

              {/* Network Status */}
              {currentChainId !== BASE_SEPOLIA.id && isConnected && (
                <div className="alert alert-warning text-sm">
                  <button onClick={handleNetworkSwitch} className="text-xs">
                    Switch to Base Sepolia Network
                  </button>
                </div>
              )}

              {/* Balance Display */}
              {balance && (
                <div className="text-sm text-gray-600">Balance: {parseFloat(balance.formatted).toFixed(4)} ETH</div>
              )}

              <input
                type="text"
                value={stakeAmount}
                onChange={handleAmountChange}
                className="input input-bordered w-full"
                placeholder="Amount in ETH"
                disabled={isPending || currentChainId !== BASE_SEPOLIA.id}
              />

              <button
                onClick={handleStake}
                className={`btn btn-primary w-full ${isPending ? "loading" : ""}`}
                disabled={
                  !stakeAmount ||
                  parseFloat(stakeAmount) <= 0 ||
                  isPending ||
                  (isConnected && currentChainId !== BASE_SEPOLIA.id)
                }
              >
                {!isConnected
                  ? "Connect Wallet"
                  : currentChainId !== BASE_SEPOLIA.id
                    ? "Switch to Base Sepolia"
                    : isPending
                      ? "Staking..."
                      : "Stake ETH"}
              </button>

              {isSuccess && (
                <div className="alert alert-success text-sm">
                  <span>Successfully staked!</span>
                </div>
              )}

              {(isError || networkError) && (
                <div className="alert alert-error text-sm">
                  <span>{networkError || error?.message || "Failed to stake"}</span>
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
