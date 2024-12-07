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
    const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
    const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

    const identicon = address ? blockies.create({ seed: address }).toDataURL() : "";



    const networks = [
        {
            id: sepolia.id,
            name: sepolia.name,
            icon: "🔵",
            config: sepolia
        },
        {
            id: baseSepolia.id,
            name: baseSepolia.name,
            icon: "🟣",
            config: baseSepolia
        },
        // You can add more networks:
        {
            id: mainnet.id,
            name: mainnet.name,
            icon: "🌐",
            config: mainnet
        },
        {
            id: base.id,
            name: base.name,
            icon: "🔷",
            config: base
        },
        {
            id: optimism.id,
            name: optimism.name,
            icon: "🔴",
            config: optimism
        }
    ];
    const currentNetwork = networks.find(network => network.id === currentChainId) || networks[0];

    const handleNetworkSwitch = async (chainId: number) => {
        try {
            const network = networks.find(n => n.id === chainId);
            if (!network) throw new Error("Network not found");

            console.log("Switching to network:", network.name); // Debug log
            await switchChain({ chainId });
            setIsNetworkMenuOpen(false);
        } catch (err) {
            console.error("Failed to switch network:", err);
            // Maybe show an error toast or message to user
        }
    };

    return (
        <div className="header-container p-3 flex justify-between items-center">
            {/* Left side - Network Selector */}
            <div className="relative">
                <button
                    className="network-selector-btn flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg"
                    onClick={() => setIsNetworkMenuOpen(!isNetworkMenuOpen)}
                >
                    <span>{currentNetwork.icon}</span>
                    <span className="text-white">{currentNetwork.name}</span>
                    <span className="ml-1">▼</span>
                </button>

                {/* Network Dropdown Menu */}
                {isNetworkMenuOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-base-200 rounded-lg shadow-xl z-50">
                        {networks.map((network) => (
                            <button
                                key={network.id}
                                className={`w-full px-4 py-2 text-left hover:bg-base-300 flex items-center gap-2 
                                ${currentChainId === network.id ? 'bg-base-300' : ''}`}
                                onClick={() => handleNetworkSwitch(network.id)}
                            >
                                <span>{network.icon}</span>
                                <span className="text-white">{network.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right side - Wallet Connection */}
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
                        <Image src={identicon} alt="Profile" className="profile-pic rounded-full" width={24} height={24} />
                        <div className="overflow-hidden w-32 text-ellipsis text-white">
                            {address}
                        </div>
                    </button>

                    {isWalletMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-base-200 rounded-lg shadow-xl z-50">
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-base-300 text-white"
                                onClick={() => {
                                    disconnect();
                                    setIsWalletMenuOpen(false);
                                }}
                            >
                                Disconnect
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NewHeader;