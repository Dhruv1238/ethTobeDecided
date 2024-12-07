import React from "react";
import Image from "next/image";
import "./Header.css";
import blockies from "ethereum-blockies";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export const NewHeader = () => {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();

  const identicon = address ? blockies.create({ seed: address }).toDataURL() : "";

  return (
    <div className="header-container p-3  ">
      {/* Friends Icon */}
      <h1 className="text-white text-xl">StakeFIT</h1>
      {/* Connect Wallet Button */}
      {!isConnected ? (
        <button className="connect-button" onClick={() => connect({ connector: injected() })}>
          Connect Wallet
        </button>
      ) : (
        <div className="connected-status flex gap-2">
          <Image src={identicon} alt="Profile" className="profile-pic" width={20} height={20} />
          <div className="overflow-hidden w-20 text-ellipsis text-white ">{address}</div>
        </div>
      )}
    </div>
  );
};
