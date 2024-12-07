"use client";

import React from "react";
import { LEADERBOARD } from "./queries";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";

interface Transfer {
  blockTimestamp: string;
  blockNumber: string;
  from: string;
  id: string;
  tokenId: string;
  transactionHash: string;
  to: string;
}

interface TransferCounts {
  address: string;
  count: number;
  tokenIds: string[];
}

export default function Leaderboard() {
  const { data, loading, error } = useQuery(LEADERBOARD);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-neon-green text-2xl">Loading Leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-error text-xl">Error: {error.message}</div>
      </div>
    );
  }

  // Process transfers data to create leaderboard
  const addressCounts = data.transfers.reduce((acc: { [key: string]: TransferCounts }, transfer: Transfer) => {
    // Count both sending and receiving
    [transfer.from, transfer.to].forEach(address => {
      if (address !== "0x0000000000000000000000000000000000000000") { // Exclude zero address
        if (!acc[address]) {
          acc[address] = {
            address,
            count: 0,
            tokenIds: []
          };
        }
        acc[address].count += 1;
        if (!acc[address].tokenIds.includes(transfer.tokenId)) {
          acc[address].tokenIds.push(transfer.tokenId);
        }
      }
    });
    return acc;
  }, {});

  // Convert to array and sort by count
  const leaderboardData = Object.values(addressCounts)
    .sort((a, b) => b.count - a.count)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  return (
    <div className="flex flex-col h-screen">
      {/* Hero Section */}
      <div className="bg-dark-surface py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-neon-green glow-text">Top NFT Traders</h1>
          <p className="text-gray-300">
            Most active addresses in NFT transfers on our platform
          </p>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="flex-grow overflow-hidden">
        <div className="max-w-2xl mx-auto p-6 h-full">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-darker-surface p-4 rounded-lg mb-3 z-10 shadow-neon-glow">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Rank & Address</span>
              <div className="flex gap-8">
                <span>Transfers</span>
                <span>NFTs</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-3 overflow-y-auto h-[calc(100vh-400px)] pr-2 custom-scrollbar">
            {leaderboardData.map((entry, index) => (
              <motion.div
                key={entry.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 rounded-lg ${
                  entry.rank === 1 ? 'bg-dark-surface border border-neon-green shadow-neon-glow' :
                  entry.rank === 2 ? 'bg-dark-surface border border-gray-500' :
                  entry.rank === 3 ? 'bg-dark-surface border border-orange-600' :
                  'bg-dark-surface'
                } hover:bg-medium-surface transition-all duration-200 transform hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.rank === 1 ? 'bg-neon-green text-black' :
                      entry.rank === 2 ? 'bg-gray-500' :
                      entry.rank === 3 ? 'bg-orange-600' :
                      'bg-medium-surface'
                    }`}>
                      <span className="font-bold">{entry.rank}</span>
                    </div>
                    <span className="text-gray-300 font-mono">
                      {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`font-bold ${
                      entry.rank === 1 ? 'text-neon-green' : 'text-gray-300'
                    }`}>
                      {entry.count}
                    </span>
                    <span className="text-gray-300">
                      {entry.tokenIds.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-dark-surface py-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-2xl font-bold text-neon-green glow-text">
              {leaderboardData.length}
            </h3>
            <p className="text-gray-300">Total Traders</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neon-green glow-text">
              {data.transfers.length}
            </h3>
            <p className="text-gray-300">Total Transfers</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neon-green glow-text">
              {new Set(data.transfers.map((t: Transfer) => t.tokenId)).size}
            </h3>
            <p className="text-gray-300">Unique NFTs</p>
          </div>
        </div>
      </div>
    </div>
  );
}