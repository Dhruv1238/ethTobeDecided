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
    // const localUrl = "http://localhost:3000";
    const localUrl = "https://62a2-14-195-142-82.ngrok-free.app"
    window.location.href = `https://small-mouse-2759.arnabbhowmik019.workers.dev/google/auth?redirect_url=${encodeURIComponent(localUrl)}/`;
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
            className="relative"
          >
            <Image 
              src="/logo.png" 
              alt="StakeFit Logo" 
              width={200} 
              height={200} 
              className="mx-auto mb-2 drop-shadow-[0_0_15px_rgba(17,206,111,0.2)]" 
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#11ce6f20] to-transparent"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#11ce6f] to-[#3b82f6] text-transparent bg-clip-text">
                Welcome to StakeFit
              </span>
            </h1>
            <p className="text-[#a3a2a7] text-lg">A bet on your Fitness</p>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#2d2c2e] rounded-2xl p-8 shadow-xl border border-[#000001]
                    backdrop-blur-lg bg-opacity-80"
        >
          <div className="space-y-6">
            <motion.button
              onClick={handleSignUp}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#11ce6f] to-[#11ce9f] text-[#000001] 
                       py-4 px-6 rounded-xl font-semibold text-lg relative overflow-hidden
                       shadow-[0_0_15px_rgba(17,206,111,0.3)] group"
            >
              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Connecting</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  </div>
                ) : (
                  "Connect with Google"
                )}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20
                         transition-opacity duration-300"
                initial={false}
              />
            </motion.button>
          </div>

          {/* Terms */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-[#a3a2a7]"
          >
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-[#11ce6f] hover:underline hover:text-[#11ce9f] transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#11ce6f] hover:underline hover:text-[#11ce9f] transition-colors">
              Privacy Policy
            </a>
          </motion.p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-[#a3a2a7] text-sm"
        >
          Start your fitness journey with StakeFit today
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;