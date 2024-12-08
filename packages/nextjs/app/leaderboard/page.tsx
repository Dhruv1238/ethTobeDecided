// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { LEADERBOARD } from "./queries";
// import { useQuery } from "@apollo/client";
// import { motion } from "framer-motion";
// import { formatEther } from "viem";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";

// interface UserStake {
//   id: string;
//   user: string;
//   totalStaked: string;
// }

// interface LeaderboardEntry {
//   rank: number;
//   address: string;
//   totalStaked: string;
//   id: string;
// }

// export default function Leaderboard() {
//   const router = useRouter();
//   const { data, loading, error } = useQuery(LEADERBOARD);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="animate-pulse text-neon-green text-2xl">Loading Leaderboard...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="text-error text-xl">Error: {error.message}</div>
//       </div>
//     );
//   }

//   const leaderboardData = data.userStakes.map((stake: UserStake, index: number) => ({
//     rank: index + 1,
//     address: stake.user,
//     totalStaked: formatEther(BigInt(stake.totalStaked)),
//     id: stake.id,
//   }));

//   const totalStaked = leaderboardData.reduce(
//     (sum: number, entry: LeaderboardEntry) => sum + Number(entry.totalStaked),
//     0,
//   );

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Hero Section with Back Button */}
//       <div className="bg-dark-surface py-8">
//         <div className="max-w-2xl mx-auto text-center relative">
//           {/* Back Button */}
//           <button
//             onClick={() => router.back()}
//             className="absolute left-6 top-1/4 -translate-y-1/2 
//                      text-neon-green text-5xl hover:text-green-400 transition-colors"
//           >
//             ←
//           </button>

//           <h1 className="text-4xl font-bold mb-4 text-neon-green glow-text">Top Stakers</h1>
//           <p className="text-gray-300">The highest stakers on our platform are showcased here</p>
//         </div>
//       </div>

//       {/* Leaderboard Section */}
//       <div className="flex-grow overflow-hidden">
//         <div className="max-w-2xl mx-auto p-6 h-full">
//           {/* Sticky Header */}
//           <div className="sticky top-0 bg-darker-surface p-4 rounded-lg mb-3 z-10 shadow-neon-glow">
//             <div className="flex justify-between text-sm text-gray-300">
//               <span>Rank & Address</span>
//               <span>Total Staked</span>
//             </div>
//           </div>

//           {/* Scrollable Content */}
//           <div className="space-y-3 overflow-y-auto h-[calc(100vh-400px)] pr-2 custom-scrollbar">
//             {leaderboardData.map((entry: LeaderboardEntry, index: number) => (
//               <motion.div
//                 key={entry.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.05 }}
//                 className={`p-4 rounded-lg ${
//                   entry.rank === 1
//                     ? "bg-dark-surface border border-neon-green shadow-neon-glow"
//                     : entry.rank === 2
//                       ? "bg-dark-surface border border-gray-500"
//                       : entry.rank === 3
//                         ? "bg-dark-surface border border-orange-600"
//                         : "bg-dark-surface"
//                 } hover:bg-medium-surface transition-all duration-200 transform hover:scale-[1.02]`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                         entry.rank === 1
//                           ? "bg-neon-green text-black"
//                           : entry.rank === 2
//                             ? "bg-gray-500"
//                             : entry.rank === 3
//                               ? "bg-orange-600"
//                               : "bg-medium-surface"
//                       }`}
//                     >
//                       <span className="font-bold">{entry.rank}</span>
//                     </div>
//                     <span className="text-gray-300 font-mono">
//                       <Address address={entry.address} format="short" />
//                     </span>
//                   </div>
//                   <span className={`font-bold ${entry.rank === 1 ? "text-neon-green" : "text-gray-300"}`}>
//                     {Number(entry.totalStaked).toFixed(4)} ETH
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="bg-dark-surface py-6">
//         <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 text-center">
//           <div>
//             <h3 className="text-2xl font-bold text-neon-green glow-text">{leaderboardData.length}</h3>
//             <p className="text-gray-300">Total Stakers</p>
//           </div>
//           <div>
//             <h3 className="text-2xl font-bold text-neon-green glow-text">{totalStaked.toFixed(4)} ETH</h3>
//             <p className="text-gray-300">Total Value Staked</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LEADERBOARD } from "./queries";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

// ... interfaces remain the same ...

interface UserStake {
  id: string;
  user: string;
  totalStaked: string;
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  totalStaked: string;
  id: string;
}

export default function Leaderboard() {
  const router = useRouter();
  const { data, loading, error } = useQuery(LEADERBOARD);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#000001]">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="StakeFit Logo" width={100} height={100} className="animate-pulse" />
          <div className="text-[#11ce6f] text-2xl font-bold">Loading Leaderboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#000001]">
        <div className="text-[#ff4444] text-xl bg-[#2d2c2e] p-6 rounded-xl border border-red-500">
          Error: {error.message}
        </div>
      </div>
    );
  }

  const leaderboardData = data.userStakes.map((stake: UserStake, index: number) => ({
    rank: index + 1,
    address: stake.user,
    totalStaked: formatEther(BigInt(stake.totalStaked)),
    id: stake.id,
  }));

  const totalStaked = leaderboardData.reduce(
    (sum: number, entry: LeaderboardEntry) => sum + Number(entry.totalStaked),
    0,
  );

  // ... data processing remains the same ...

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#000001]">
      {/* Hero Section with Back Button */}
      <div className="bg-[#2d2c2e] py-8 shadow-[0_0_15px_rgba(17,206,111,0.1)]">
        <div className="max-w-2xl mx-auto text-center relative px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => router.back()}
            className="absolute left-6 top-1/4 -translate-y-1/2 
                     text-[#11ce6f] hover:text-[#3b82f6] transition-colors"
          >
            <ArrowLeftIcon className="w-8 h-8" />
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#11ce6f] to-[#3b82f6] text-transparent bg-clip-text"
          >
            Top Stakers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#a3a2a7]"
          >
            The highest stakers on StakeFit are showcased here
          </motion.p>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="flex-grow overflow-hidden">
        <div className="max-w-2xl mx-auto p-6 h-full">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-[#2d2c2e] p-4 rounded-lg mb-3 z-10 
                         shadow-[0_0_15px_rgba(17,206,111,0.1)] border border-[#11ce6f33]">
            <div className="flex justify-between text-sm text-[#a3a2a7]">
              <span>Rank & Address</span>
              <span>Total Staked</span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-3 overflow-y-auto h-[calc(100vh-400px)] pr-2 custom-scrollbar">
            {leaderboardData.map((entry: LeaderboardEntry, index: number) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 rounded-lg ${entry.rank === 1
                    ? "bg-[#2d2c2e] border border-[#11ce6f] shadow-[0_0_15px_rgba(17,206,111,0.2)]"
                    : entry.rank === 2
                      ? "bg-[#2d2c2e] border border-[#3b82f6]"
                      : entry.rank === 3
                        ? "bg-[#2d2c2e] border border-[#f97316]"
                        : "bg-[#2d2c2e]"
                  } hover:bg-[#3d3c3e] transition-all duration-200 transform hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${entry.rank === 1
                          ? "bg-[#11ce6f] text-black"
                          : entry.rank === 2
                            ? "bg-[#3b82f6]"
                            : entry.rank === 3
                              ? "bg-[#f97316]"
                              : "bg-[#3d3c3e]"
                        }`}
                    >
                      <span className="font-bold">{entry.rank}</span>
                    </div>
                    <span className="text-[#a3a2a7] font-mono">
                      <Address address={entry.address} format="short" />
                    </span>
                  </div>
                  <span className={`font-bold ${entry.rank === 1 ? "text-[#11ce6f]" : "text-[#a3a2a7]"
                    }`}>
                    {Number(entry.totalStaked).toFixed(4)} ETH
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#2d2c2e] py-6 shadow-[0_0_15px_rgba(17,206,111,0.1)]">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-[#11ce6f]">{leaderboardData.length}</h3>
            <p className="text-[#a3a2a7]">Total Stakers</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-[#11ce6f]">{totalStaked.toFixed(4)} ETH</h3>
            <p className="text-[#a3a2a7]">Total Value Staked</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}