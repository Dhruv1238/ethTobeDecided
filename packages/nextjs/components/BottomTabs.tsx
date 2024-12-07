// components/BottomTabs.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGamepad, FaHome, FaTrophy, FaWallet } from "react-icons/fa";

// components/BottomTabs.tsx

// components/BottomTabs.tsx

// components/BottomTabs.tsx

export const BottomTabs = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-100 shadow-t flex justify-around items-center py-3">
      <Link href="/home">
        <div className={router.pathname === "/home" ? "text-primary" : "text-base-content"}>
          <FaHome size={24} />
        </div>
      </Link>
      <Link href="/wallet">
        <div className={router.pathname === "/wallet" ? "text-primary" : "text-base-content"}>
          <FaWallet size={24} />
        </div>
      </Link>
      <Link href="/games">
        <div className={router.pathname === "/games" ? "text-primary" : "text-base-content"}>
          <FaGamepad size={24} />
        </div>
      </Link>
      <Link href="/leaderboard">
        <div className={router.pathname === "/leaderboard" ? "text-primary" : "text-base-content"}>
          <FaTrophy size={24} />
        </div>
      </Link>
    </div>
  );
};
