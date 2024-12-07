"use client";

import React from "react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  address: string;
  score: number;
  eth: number;
}

const LeaderBoard = () => {
  // Sample data
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, address: "0x1234...5678", score: 1500, eth: 2.5 },
    { rank: 2, address: "0x8765...4321", score: 1400, eth: 2.2 },
    { rank: 3, address: "0x9876...1234", score: 1300, eth: 2.0 },
    { rank: 4, address: "0x5432...8765", score: 1200, eth: 1.8 },
    { rank: 5, address: "0x2468...1357", score: 1100, eth: 1.5 },
    { rank: 6, address: "0x1357...2468", score: 1000, eth: 1.3 },
    { rank: 7, address: "0x3691...2580", score: 900, eth: 1.1 },
    { rank: 8, address: "0x2580...3691", score: 800, eth: 0.9 },
    { rank: 9, address: "0x1470...2581", score: 700, eth: 0.7 },
    { rank: 10, address: "0x3692...1470", score: 600, eth: 0.5 },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Leaderboard</h2>
      
      <div className="space-y-3">
        {leaderboardData.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg ${
              entry.rank === 1 ? 'bg-yellow-500/20' :
              entry.rank === 2 ? 'bg-gray-400/20' :
              entry.rank === 3 ? 'bg-orange-600/20' :
              'bg-base-200'
            } hover:bg-base-300 transition-colors`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold ${
                  entry.rank === 1 ? 'text-yellow-500' :
                  entry.rank === 2 ? 'text-gray-400' :
                  entry.rank === 3 ? 'text-orange-600' :
                  'text-white'
                }`}>
                  #{entry.rank}
                </span>
                <span className="text-white">{entry.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-primary">{entry.score} pts</span>
                <span className="text-green-500">{entry.eth} ETH</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;