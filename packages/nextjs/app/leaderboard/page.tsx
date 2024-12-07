"use client";

import React from "react";
import { LEADERBOARD } from "./queries";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  address: string;
  score: number;
  eth: number;
}

export default function Leaderboard() {
  const { data, loading, error } = useQuery(LEADERBOARD);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);

  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, address: "0x1234...5678", score: 1500, eth: 2.5 },
    { rank: 2, address: "0x8765...4321", score: 1450, eth: 2.45 },
    { rank: 3, address: "0x9876...1234", score: 1400, eth: 2.4 },
    { rank: 4, address: "0x5432...8765", score: 1350, eth: 2.35 },
    { rank: 5, address: "0x2468...1357", score: 1300, eth: 2.3 },
  ];

  // Generate additional entries with predictable values
  const extendedData = [...leaderboardData];
  for (let i = leaderboardData.length + 1; i <= 50; i++) {
    extendedData.push({
      rank: i,
      address: `0x${i.toString().padStart(4, "0")}...${(1000 - i).toString().padStart(4, "0")}`,
      score: Math.max(0, 1500 - i * 20),
      eth: Number((2.5 - i * 0.05).toFixed(2)),
    });
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Hero Section */}
      <div className="bg-base-300 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Top Stakers</h1>
          <p className="text-base-content">
            The highest stakers on our platform are showcased here. Join them by staking your ETH!
          </p>
        </div>
      </div>

      {/* Scrollable Leaderboard Section */}
      <div className="flex-grow overflow-hidden">
        <div className="max-w-2xl mx-auto p-6 h-full">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-base-100 p-4 rounded-lg mb-3 z-10 shadow-lg">
            <div className="flex justify-between text-sm text-base-content">
              <span>Rank & Address</span>
              <div className="flex gap-8 pr-4">
                <span>Score</span>
                <span>Staked</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-3 overflow-y-auto h-[calc(100vh-400px)] pr-2 custom-scrollbar">
            {extendedData.map((entry, index) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 rounded-lg ${
                  entry.rank === 1
                    ? "bg-yellow-500/20 border border-yellow-500/50"
                    : entry.rank === 2
                      ? "bg-gray-400/20 border border-gray-400/50"
                      : entry.rank === 3
                        ? "bg-orange-600/20 border border-orange-600/50"
                        : "bg-base-200"
                } hover:bg-base-300 transition-all duration-200 transform hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        entry.rank === 1
                          ? "bg-yellow-500"
                          : entry.rank === 2
                            ? "bg-gray-400"
                            : entry.rank === 3
                              ? "bg-orange-600"
                              : "bg-base-300"
                      }`}
                    >
                      <span className="font-bold text-base-100">{entry.rank}</span>
                    </div>
                    <span className="text-white font-mono">{entry.address}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className=" font-bold text-gray-400">{entry.score}</span>
                    </div>
                    <div className="flex flex-col items-end min-w-[80px]">
                      <span className="text-green-500 font-bold">{entry.eth} ETH</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
