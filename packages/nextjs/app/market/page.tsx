"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Address } from "~~/components/scaffold-eth";

interface Challenge {
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  timestamp: string;
}

export default function Marketplace() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const CONTRACT_ADDRESS = "0x52de6508fecca4d712b75b0bd018a621eaf2d734";
  const BASESCAN_API_KEY = "S2XU7JFMYP19BV6QY13467RAI8EG3H4MHW";
  const BASESCAN_API_URL = "https://api-sepolia.basescan.org/api";

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        // Fetch all mint events
        const response = await fetch(
          `${BASESCAN_API_URL}?module=account&action=tokennfttx&contractaddress=${CONTRACT_ADDRESS}&apikey=${BASESCAN_API_KEY}`
        );
        const data = await response.json();

        if (data.status === "1" && data.result) {
          const nfts = await Promise.all(
            data.result.map(async (tx: any) => {
              // Fetch transaction input data
              const txResponse = await fetch(
                `${BASESCAN_API_URL}?module=proxy&action=eth_getTransactionByHash&txhash=${tx.hash}&apikey=${BASESCAN_API_KEY}`
              );
              const txData = await txResponse.json();

              // Decode input data
              const inputData = txData.result.input;
              const decodedData = decodeInputData(inputData);

              return {
                tokenId: tx.tokenID,
                name: decodedData.name,
                description: decodedData.description,
                imageUrl: decodedData.imageUrl,
                owner: tx.to,
                timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString(),
              };
            })
          );

          setChallenges(nfts);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const decodeInputData = (input: string) => {
    try {
      // Remove function selector (first 4 bytes / 8 characters after '0x')
      const data = input.slice(10);

      // Convert hex to string and clean up
      const decoded = Buffer.from(data, "hex").toString("utf8");

      // Find the indices of the main components
      const descStart = decoded.indexOf("[Ai-generated fitness message:");
      const imageStart = decoded.indexOf("https://");

      return {
        name: "StakeFit Challenge",
        description: decoded.slice(descStart, imageStart).trim(),
        imageUrl: decoded.slice(imageStart).trim(),
      };
    } catch (error) {
      console.error("Error decoding input data:", error);
      return {
        name: "StakeFit Challenge",
        description: "Push-ups rush!!",
        imageUrl: "https://walrus-ms.onrender.com/retrieve/default",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="StakeFit Logo" width={80} height={80} className="animate-pulse" />
          <div className="text-neon-green text-2xl">Loading Challenges...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-[#1a1a1a]">
      {/* Hero Section */}
      <div className="bg-dark-surface py-8">
        <div className="max-w-6xl mx-auto text-center relative px-4">
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-1/4 -translate-y-1/2 
                     text-neon-green text-5xl hover:text-green-400 transition-colors"
          >
            ←
          </button>

          <div className="flex flex-col items-center justify-center gap-4">
            <Image src="/logo.png" alt="StakeFit Logo" width={60} height={60} />
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-2xl">Welcome to </span>
                <span className="text-4xl font-bold text-neon-green">StakeFit</span>
              </h1>
              <p className="text-gray-300">Track your fitness achievements and daily challenges</p>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.tokenId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-dark-surface rounded-xl overflow-hidden border border-[#000001] hover:border-neon-green
                         transition-all duration-200 transform hover:scale-[1.02] shadow-neon-glow"
              >
                {/* Challenge Image */}
                <div className="aspect-square relative overflow-hidden bg-[#2d2c2e]">
                  <img
                    src={challenge.imageUrl}
                    alt={challenge.name}
                    className="object-cover w-full h-full"
                    onError={e => {
                      e.currentTarget.src = "/logo.png";
                    }}
                  />
                </div>

                {/* Challenge Details */}
                <div className="p-4">
                  <h3 className="text-[#fbf8fe] font-bold text-xl mb-2">
                    {challenge.name} #{challenge.tokenId}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>

                  {/* Owner & Date */}
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Completed by:</span>
                      <Address address={challenge.owner} format="short" />
                    </div>
                    <div className="text-gray-400 text-sm">Completed on: {challenge.timestamp}</div>
                  </div>

                  {/* Achievement Badge */}
                  <div className="bg-[#000001] rounded-lg p-2 text-sm">
                    <div className="text-gray-400">Achievement</div>
                    <div className="text-neon-green font-medium">Daily Fitness Challenge Completed</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-dark-surface py-6 mb-16">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-2xl font-bold text-neon-green glow-text">{challenges.length}</h3>
            <p className="text-gray-300">Total Challenges</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neon-green glow-text">
              {new Set(challenges.map(c => c.owner)).size}
            </h3>
            <p className="text-gray-300">Unique Athletes</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neon-green glow-text">
              {challenges.length > 0 ? "Active" : "Completed"}
            </h3>
            <p className="text-gray-300">Challenge Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}