"use client";

import { useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import axios from "axios";
import { AuthGuard } from "~~/components/AuthGuard";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { ApolloProvider } from "~~/context/ApolloProvider";
import { FitnessProvider, useFitness } from "~~/context/FitnessContext";
import "~~/styles/globals.css";
import { useAuth, AuthProvider } from "~~/context/AuthContext";
import { useRouter } from "next/navigation";
// import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { RainbowKitProviders } from './providers';
import { config } from '~~/utils/rainbowConfig';
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

const TokenHandler = ({ children }: { children: React.ReactNode }) => {
  const { setTokens, accessToken } = useAuth();
  const { setFitnessData } = useFitness();
  const router = useRouter();

  useEffect(() => {
    const handleTokens = async () => {
      // Only process tokens if they're in the URL
      if (!window.location.search.includes('access_token')) return;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const newAccessToken = urlParams.get("access_token");
        const idToken = urlParams.get("id_token");
        const refreshToken = urlParams.get("refresh_token");

        if (newAccessToken) {
          // Set tokens first
          await setTokens(newAccessToken, idToken, refreshToken);
          
          // Clear URL parameters
          window.history.replaceState({}, '', '/');
          
          // Force reload to clear any stale state
          window.location.href = '/';
        }
      } catch (error) {
        console.error("Error handling tokens:", error);
        router.push('/login');
      }
    };

    handleTokens();
  }, []); // Empty dependency array as we only want this to run once

  // Separate effect for fitness data
  useEffect(() => {
    if (!accessToken) return;

    const fetchFitnessData = async () => {
      try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

        const response = await axios.post(
          "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
          {
            aggregateBy: [{
              dataTypeName: "com.google.step_count.delta"
            }],
            startTimeMillis: startOfDay,
            endTimeMillis: endOfDay,
            bucketByTime: { durationMillis: 86400000 }
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        setFitnessData(response.data);
      } catch (error) {
        console.error("Fitness API Error:", error);
      }
    };

    fetchFitnessData();
  }, [accessToken, setFitnessData]);

  return <>{children}</>;
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <AuthProvider>
            {/* <RainbowKitProviders> */}
              <ScaffoldEthAppWithProviders>
                <ApolloProvider>
                  <FitnessProvider>
                    <AuthGuard>
                      <TokenHandler>{children}</TokenHandler>
                    </AuthGuard>
                  </FitnessProvider>
                </ApolloProvider>
              </ScaffoldEthAppWithProviders>
            {/* </RainbowKitProviders> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;