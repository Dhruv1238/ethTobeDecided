"use client"
import React, { useState } from "react";

interface StakeBalanceProps {
  initialBalance: number;
}

const StakeBalance: React.FC<StakeBalanceProps> = ({ initialBalance }) => {
  const [balance, setBalance] = useState(initialBalance);
  const [stakeAmount, setStakeAmount] = useState(0);

  const handleStake = () => {
    if (stakeAmount > 0) {
      setBalance(balance + stakeAmount);
      setStakeAmount(0);
    }
  };

  return (
    <div className="flex flex-col items-center bg-base-100 p-5 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-base-content">Your Staking Balance</h2>
      <p className="text-lg mb-4 text-base-content">Current Balance: {balance} tokens</p>
      <input
        type="number"
        value={stakeAmount}
        onChange={(e) => setStakeAmount(Number(e.target.value))}
        className="input input-bordered w-full max-w-xs mb-4"
        placeholder="Enter amount to stake"
      />
      <button
        onClick={handleStake}
        className="btn btn-primary"
        disabled={stakeAmount <= 0}
      >
        Stake Tokens
      </button>
    </div>
  );
};

export default StakeBalance;  