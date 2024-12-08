import React from "react";
import Image from "next/image";
import "./Header.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const NewHeader = () => {
    return (
        <div className="header-container p-3 flex justify-between items-center relative z-[100]">
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

            {/* Right side - RainbowKit Connect Button */}
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                        <div
                            {...(!ready && {
                                'aria-hidden': true,
                                style: {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            })}
                        >
                            {(() => {
                                if (!connected) {
                                    return (
                                        <button
                                            onClick={openConnectModal}
                                            className="connect-button bg-gradient-to-r from-[#11ce6f] to-[#3b82f6] px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                                        >
                                            Connect Wallet
                                        </button>
                                    );
                                }

                                return (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={openChainModal}
                                            className="connected-status flex items-center gap-2 bg-[#2d2c2e] px-4 py-2 rounded-lg hover:bg-[#3d3c3e] transition-colors"
                                        >
                                            {chain.hasIcon && chain.iconUrl && (
                                                <Image
                                                    alt={chain.name}
                                                    src={chain.iconUrl}
                                                    width={20}
                                                    height={20}
                                                />
                                            )}
                                            <span className="text-white text-sm">{chain.name}</span>
                                        </button>

                                        <button
                                            onClick={openAccountModal}
                                            className="connected-status flex items-center gap-2 bg-[#2d2c2e] px-4 py-2 rounded-lg hover:bg-[#3d3c3e] transition-colors"
                                        >
                                            <span className="text-white text-sm">{account.displayName}</span>
                                            <span className="text-[#11ce6f] text-sm">{account.displayBalance}</span>
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </div>
    );
};

export default NewHeader;