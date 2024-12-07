import React, { useState } from "react";
import Image from "next/image";
import "./Header.css";
import blockies from "ethereum-blockies";
import { useAccount, useConnect, useChainId, useSwitchChain, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia, baseSepolia, mainnet, base, optimism } from "viem/chains";

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
        { id: optimism.id, name: optimism.name, icon: "🔴", config: optimism }
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
        <div className="header-container p-3 flex justify-between items-center">
            {/* Left side - Logo */}
            <div className="flex items-center">
                <span className="text-xl font-bold text-white">StakeFIT</span>
            </div>

            {/* Right side - Wallet Connection with Network Selection */}
            {!isConnected ? (
                <button
                    className="connect-button bg-primary px-4 py-2 rounded-lg text-white hover:bg-primary-focus"
                    onClick={() => connect({ connector: injected() })}
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="relative">
                    <button
                        className="connected-status flex items-center gap-3 bg-base-200 px-4 py-2 rounded-lg hover:bg-base-300"
                        onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                    >
                        <span className="flex items-center gap-2">
                            <span>{currentNetwork.icon}</span>
                            <span className="text-white text-sm">{currentNetwork.name}</span>
                        </span>
                        <Image src={identicon} alt="Profile" className="profile-pic rounded-full" width={24} height={24} />
                        <div className="overflow-hidden w-24 text-ellipsis text-white">
                            {address}
                        </div>
                    </button>

                    {isWalletMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-base-200 rounded-lg shadow-xl z-50">
                            {/* Network Selection */}
                            <div className="p-2 border-b border-base-300">
                                <div className="text-sm text-base-content mb-2 px-2">Switch Network</div>
                                {networks.map((network) => (
                                    <button
                                        key={network.id}
                                        className={`w-full px-4 py-2 text-left hover:bg-base-300 flex items-center gap-2 rounded-lg
                                        ${currentChainId === network.id ? 'bg-base-300' : ''}`}
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
                                    className="w-full px-4 py-2 text-left hover:bg-base-300 text-white rounded-lg flex items-center gap-2"
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
                    )}
                </div>
            )}
        </div>
    );
};

export default NewHeader;