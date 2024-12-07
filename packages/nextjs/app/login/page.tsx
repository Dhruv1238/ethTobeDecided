"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    setIsLoading(true);
    window.location.href =
      "https://small-mouse-2759.arnabbhowmik019.workers.dev/google/auth?redirect_url=http%3A%2F%2Flocalhost%3A3000/";
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      router.push("/");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#000001] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Image src="/logo.png" alt="StakeFIT Logo" width={150} height={150} className="mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-[#fbf8fe] mb-2">Welcome to StakeFIT</h1>
          <p className="text-[#a3a2a7]">Stake your health, earn rewards</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#2d2c2e] rounded-2xl p-8 shadow-xl border border-[#000001]"
        >
          <div className="space-y-6">
            {/* Demo Account Button */}
            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full bg-[#11ce6f] text-[#000001] 
                       py-4 px-6 rounded-xl font-semibold text-lg
                       transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
          </div>

          {/* Terms */}
          <p className="mt-8 text-center text-sm text-[#a3a2a7]">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-[#11ce6f] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#11ce6f] hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
