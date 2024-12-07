"use client";

import React, { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useBalance, useChainId, useConnect, useSwitchChain, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "viem/chains";

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

  const { data: balance } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  useEffect(() => {
    if (isConnected && currentChainId !== baseSepolia.id) {
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

      if (currentChainId !== baseSepolia.id) {
        await switchChain({ chainId: baseSepolia.id });
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
        {currentChainId !== baseSepolia.id && isConnected && (
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
            : currentChainId !== baseSepolia.id
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