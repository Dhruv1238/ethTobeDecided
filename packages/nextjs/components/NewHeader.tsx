import React from "react";
import Link from "next/link";
import { FaUserFriends } from "react-icons/fa";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import blockies from 'ethereum-blockies';
import './Header.css';

export const NewHeader = () => {
    const { isConnected, address } = useAccount();
    const { connect } = useConnect();

    const identicon = address ? blockies.create({ seed: address }).toDataURL() : '';

    return (
        <div className="header-container">
            {/* Friends Icon */}
            <Link href="/friends" className="icon-link">
                <FaUserFriends size={24} />
            </Link>
            {/* Connect Wallet Button */}
            {!isConnected ? (
                <button className="connect-button" onClick={() => connect({ connector: injected() })}>
                    Connect Wallet
                </button>
            ) : (
                <div className="connected-status">
                    <img src={identicon} alt="Profile" className="profile-pic" /> 
                    <span>{address}</span>
                </div>
            )}
        </div>
    );
};