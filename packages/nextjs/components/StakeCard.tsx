"use client";

import React, { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useBalance, useChainId, useConnect, useSwitchChain, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";

interface StakeCardProps {
  contractAddress: `0x${string}`;
  contractABI: any;
}

const StakeCard: React.FC<StakeCardProps> = ({ contractAddress, contractABI }) => {
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [networkError, setNetworkError] = useState<string>("");

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();

  const BASE_SEPOLIA = {
    id: 84532,
    name: "Base Sepolia",
    network: "base-sepolia",
    nativeCurrency: { decimals: 18, name: "Base Sepolia Ether", symbol: "ETH" },
    rpcUrls: {
      default: { http: ["https://sepolia.base.org"] },
      public: { http: ["https://sepolia.base.org"] },
    },
    blockExplorers: {
      default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
    },
    testnet: true,
  };

  const { data: balance } = useBalance({
    address,
    chainId: BASE_SEPOLIA.id,
  });

  useEffect(() => {
    if (isConnected && currentChainId !== BASE_SEPOLIA.id) {
      setNetworkError("Please switch to Base Sepolia network");
    } else {
      setNetworkError("");
    }
  }, [currentChainId, isConnected]);

  const handleStake = async () => {
    try {
      if (!isConnected) {
        await connect({ connector: injected() });
        return;
      }

      if (currentChainId !== BASE_SEPOLIA.id) {
        await switchChain({ chainId: BASE_SEPOLIA.id });
        return;
      }

      const amount = parseFloat(stakeAmount);
      if (!amount || amount <= 0) throw new Error("Please enter a valid amount");

      const stakeAmountWei = parseEther(stakeAmount);
      if (balance && stakeAmountWei > balance.value) {
        throw new Error("Insufficient Base Sepolia ETH balance");
      }

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

  return (
    <div className="card bg-dark-surface shadow-neon-glow w-full max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-neon-green mb-4">Stake ETH</h2>
        
        {/* Network Warning */}
        {currentChainId !== BASE_SEPOLIA.id && isConnected && (
          <div className="alert alert-warning text-sm mb-4">
            Wrong network. Please switch to Base Sepolia
          </div>
        )}

        {/* Balance Display */}
        {balance && (
          <div className="text-gray-300 mb-4">
            Balance: {parseFloat(balance.formatted).toFixed(4)} ETH
          </div>
        )}

        {/* Stake Input */}
        <div className="form-control">
          <input
            type="text"
            value={stakeAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                setStakeAmount(value);
              }
            }}
            className="input input-bordered bg-medium-surface text-white"
            placeholder="Amount in ETH"
            disabled={isPending}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleStake}
          className={`btn btn-primary mt-4 ${isPending ? "loading" : ""}`}
          disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isPending}
        >
          {!isConnected
            ? "Connect Wallet"
            : currentChainId !== BASE_SEPOLIA.id
              ? "Switch Network"
              : isPending
                ? "Staking..."
                : "Stake ETH"}
        </button>

        {/* Status Messages */}
        {isSuccess && (
          <div className="alert alert-success text-sm mt-4">
            Successfully staked!
          </div>
        )}

        {(isError || networkError) && (
          <div className="alert alert-error text-sm mt-4">
            {networkError || error?.message || "Failed to stake"}
          </div>
        )}
      </div>
    </div>
  );
};

export default StakeCard;