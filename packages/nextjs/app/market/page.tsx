"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Address } from "~~/components/scaffold-eth";

// Dummy NFT data
const DUMMY_NFTS = [
  {
    id: "1",
    tokenId: "1",
    owner: "0x1234567890123456789012345678901234567890",
    metadata: {
      name: "Cyber Runner #1",
      description: "A futuristic cyber athlete in neon-lit streets",
      image: "https://picsum.photos/400/400?random=1",
      attributes: [
        { trait_type: "Background", value: "Neon City" },
        { trait_type: "Rarity", value: "Legendary" },
        { trait_type: "Power Level", value: "89" }
      ]
    },
  },
  {
    id: "2",
    tokenId: "2",
    owner: "0x2345678901234567890123456789012345678901",
    metadata: {
      name: "Digital Dreams #42",
      description: "Abstract digital art with vibrant colors and geometric patterns",
      image: "https://picsum.photos/400/400?random=2",
      attributes: [
        { trait_type: "Style", value: "Abstract" },
        { trait_type: "Colors", value: "Vibrant" },
        { trait_type: "Edition", value: "42/100" }
      ]
    },
  },
  {
    id: "3",
    tokenId: "3",
    owner: "0x3456789012345678901234567890123456789012",
    metadata: {
      name: "Neon Samurai",
      description: "A modern warrior in a cyberpunk setting",
      image: "https://picsum.photos/400/400?random=3",
      attributes: [
        { trait_type: "Class", value: "Warrior" },
        { trait_type: "Weapon", value: "Plasma Katana" },
        { trait_type: "Level", value: "75" }
      ]
    },
  },
];

export default function Marketplace() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero Section with Back Button */}
      <div className="bg-dark-surface py-8">
        <div className="max-w-6xl mx-auto text-center relative px-4">
          <button
            onClick={() => router.back()}
            className="absolute left-6 top-1/4 -translate-y-1/2 
                     text-neon-green text-5xl hover:text-green-400 transition-colors"
          >
            ←
          </button>

          <h1 className="text-4xl font-bold mb-4 text-neon-green glow-text">NFT Gallery</h1>
          <p className="text-gray-300">View your collection of unique digital assets</p>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="flex-grow bg-[#1a1a1a] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_NFTS.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-dark-surface rounded-xl overflow-hidden border border-[#000001] hover:border-neon-green
                         transition-all duration-200 transform hover:scale-[1.02] shadow-neon-glow"
              >
                {/* NFT Image */}
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* NFT Details */}
                <div className="p-4">
                  <h3 className="text-[#fbf8fe] font-bold text-xl mb-2">{nft.metadata.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{nft.metadata.description}</p>
                  
                  {/* Owner */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 text-sm">Owner:</span>
                    <Address address={nft.owner} format="short" />
                  </div>

                  {/* Attributes */}
                  <div className="grid grid-cols-2 gap-2">
                    {nft.metadata.attributes.map((attr, i) => (
                      <div 
                        key={i}
                        className="bg-[#000001] rounded-lg p-2 text-sm"
                      >
                        <div className="text-gray-400">{attr.trait_type}</div>
                        <div className="text-neon-green font-medium">{attr.value}</div>
                      </div>
                    ))}
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
            <h3 className="text-2xl font-bold text-neon-green glow-text">{DUMMY_NFTS.length}</h3>
            <p className="text-gray-300">Total NFTs</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neon-green glow-text">
              {DUMMY_NFTS[0].metadata.attributes.length}
            </h3>
            <p className="text-gray-300">Attributes</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neon-green glow-text">
              {new Set(DUMMY_NFTS.map(nft => nft.owner)).size}
            </h3>
            <p className="text-gray-300">Unique Owners</p>
          </div>
        </div>
      </div>
    </div>
  );
}