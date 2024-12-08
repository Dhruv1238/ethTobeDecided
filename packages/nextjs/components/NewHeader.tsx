import React, { useState } from "react";
import Image from "next/image";
import "./Header.css";
import blockies from "ethereum-blockies";
import { base, baseSepolia, mainnet, optimism, sepolia } from "viem/chains";
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";

export const NewHeader = () => {
    const { isConnected, address } = useAccount();
    const { connect } = useConnect();
    const { switchChain } = useSwitchChain();
    const currentChainId = useChainId();
    const { disconnect } = useDisconnect();
    const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

    const identicon = address ? blockies.create({ seed: address }).toDataURL() : "";

    const networks = [
        { id: sepolia.id, name: sepolia.name, icon: "🔵", config: sepolia },
        { id: baseSepolia.id, name: baseSepolia.name, icon: "🟣", config: baseSepolia },
        { id: mainnet.id, name: mainnet.name, icon: "🌐", config: mainnet },
        { id: base.id, name: base.name, icon: "🔷", config: base },
        { id: optimism.id, name: optimism.name, icon: "🔴", config: optimism },
    ];

    const currentNetwork = networks.find(network => network.id === currentChainId) || networks[0];

    const handleNetworkSwitch = async (chainId: number) => {
        try {
            await switchChain({ chainId });
        } catch (err) {
            console.error("Failed to switch network:", err);
        }
    };
    return (
        <div className="header-container p-3 flex justify-between items-center relative z-[100]"> {/* Increased z-index */}
            {/* Left side - Logo */}
            <div className="flex items-center gap-2">
                <Image
                    src="/logo.png"
                    alt="Stake Fit Logo"
                    width={70}
                    height={70}
                    className="rounded-full"
                />
            </div>

            {/* Right side - Wallet Connection with Network Selection */}
            {!isConnected ? (
                <button
                    className="connect-button bg-gradient-to-r from-[#11ce6f] to-[#3b82f6] px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                    onClick={() => connect({ connector: injected() })}
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="relative">
                    <button
                        className="connected-status flex items-center gap-3 bg-[#2d2c2e] px-4 py-2 rounded-lg hover:bg-[#3d3c3e] transition-colors"
                        onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                    >
                        <span className="flex items-center gap-2">
                            <span>{currentNetwork.icon}</span>
                            <span className="text-white text-sm">{currentNetwork.name}</span>
                        </span>
                        <Image src={identicon} alt="Profile" className="profile-pic rounded-full" width={24} height={24} />
                        <div className="overflow-hidden w-24 text-ellipsis text-white">{address}</div>
                    </button>

                    {isWalletMenuOpen && (
                        <div className="fixed inset-0 z-[150]"> {/* Full-screen overlay to handle clicks */}
                            <div className="absolute inset-0" onClick={() => setIsWalletMenuOpen(false)}></div>
                            <div className="absolute right-3 mt-2 w-56 bg-[#2d2c2e] rounded-lg shadow-xl">
                                {/* Network Selection */}
                                <div className="p-2 border-b border-[#3d3c3e]">
                                    <div className="text-sm text-[#a3a2a7] mb-2 px-2">Switch Network</div>
                                    {networks.map(network => (
                                        <button
                                            key={network.id}
                                            className={`w-full px-4 py-2 text-left hover:bg-[#3d3c3e] flex items-center gap-2 rounded-lg
                                                    ${currentChainId === network.id ? "bg-[#3d3c3e]" : ""}`}
                                            onClick={() => handleNetworkSwitch(network.id)}
                                        >
                                            <span>{network.icon}</span>
                                            <span className="text-white">{network.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Wallet Actions */}
                                <div className="p-2">
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-[#3d3c3e] text-white rounded-lg flex items-center gap-2"
                                        onClick={() => {
                                            disconnect();
                                            setIsWalletMenuOpen(false);
                                        }}
                                    >
                                        <span>🔌</span>
                                        <span>Disconnect</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NewHeader;