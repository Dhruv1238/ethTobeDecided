"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaWallet, FaGamepad, FaTrophy } from "react-icons/fa";

export const BottomTabs = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-100 shadow-t flex justify-around items-center py-3">
      <Link href="/home">
        <div className={pathname === "/home" ? "text-primary" : "text-base-content"}>
          <FaHome size={24} />
        </div>
      </Link>
      <Link href="/wallet">
        <div className={pathname === "/wallet" ? "text-primary" : "text-base-content"}>
          <FaWallet size={24} />
        </div>
      </Link>
      <Link href="/games">
        <div className={pathname === "/games" ? "text-primary" : "text-base-content"}>
          <FaGamepad size={24} />
        </div>
      </Link>
      <Link href="/leaderboard">
        <div className={pathname === "/leaderboard" ? "text-primary" : "text-base-content"}>
          <FaTrophy size={24} />
        </div>
      </Link>
    </div>
  );
};