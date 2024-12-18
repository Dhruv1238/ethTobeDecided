"use client";

import React, { useState } from "react";
import { parseEther } from "viem";
import { sepolia, baseSepolia } from "viem/chains";
import { useAccount, useChainId, useConnect, useSwitchChain, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";

interface StakeBalanceProps {
  initialBalance: number;
  contractAddress: `0x${string}`;
  contractABI: any;
  chainId: number;
}

const StakeBalance: React.FC<StakeBalanceProps> = ({ initialBalance, contractAddress, contractABI }) => {
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

    if (currentChainId !== baseSepolia.id) {
      try {
        await switchChain({ chainId: baseSepolia.id });
        return;
      } catch (err) {
        console.error("Failed to switch network:", err);
        return;
      }
    }

    if (!stakeAmount || Number(stakeAmount) <= 0) {
      console.error("Please enter a valid stake amount");
      return;
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setStakeAmount(value);
    }
  };

  if (!contractABI || !contractAddress) {
    return (
      <div className="alert alert-error">
        <span>Contract configuration missing</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-base-100 p-5 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-base-content">Your Staking Balance</h2>
      <p className="text-lg mb-4 text-base-content">Current Balance: {initialBalance} ETH</p>

      <div className="form-control w-full max-w-xs mb-4">
        <label className="label">
          <span className="label-text">Amount to Stake (ETH)</span>
        </label>
        <input
          type="text"
          value={stakeAmount}
          onChange={handleAmountChange}
          className="input input-bordered w-full"
          placeholder="0.0"
          disabled={isPending}
        />
      </div>

      <button
        onClick={handleStake}
        className={`btn btn-primary w-full max-w-xs ${isPending ? "loading" : ""}`}
        disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isPending}
      >
        {!isConnected ? "Connect Wallet" : isPending ? "Staking..." : "Stake ETH"}
      </button>

      {/* Status Messages */}
      {isSuccess && (
        <div className="alert alert-success mt-4">
          <span>Successfully staked {stakeAmount} ETH!</span>
        </div>
      )}

      {isError && (
        <div className="alert alert-error mt-4">
          <span>Error: {error?.message || "Failed to stake"}</span>
        </div>
      )}
    </div>
  );
};

export default StakeBalance;
