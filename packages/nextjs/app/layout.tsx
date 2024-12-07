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

const TokenHandler = ({ children }: { children: React.ReactNode }) => {
  const { setFitnessData, setAccessToken,   setRefreshToken } = useFitness();

  useEffect(() => {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const idToken = urlParams.get("id_token");
    const refreshToken = urlParams.get("refresh_token");

    if (accessToken || idToken || refreshToken) {
      console.log("Access Token:", accessToken);
      console.log("ID Token:", idToken);
      console.log("Refresh Token:", refreshToken);

      localStorage.setItem("access_token", accessToken || "");
      localStorage.setItem("id_token", idToken || "");
      localStorage.setItem("refresh_token", refreshToken || "");

      if (accessToken) {
        setAccessToken(accessToken);
      }

      // Fetch fitness data
      const fetchFitnessData = async () => {
        // Get today's start and end timestamps
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

        const data = {
          aggregateBy: [
            {
              dataTypeName: "com.google.step_count.delta",
            },
          ],
          startTimeMillis: startOfDay,
          endTimeMillis: endOfDay,
          bucketByTime: {
            durationMillis: 86400000, // 24 hours in milliseconds
          },
        };

        // Fetch fitness data
        try {
          const now = new Date();
          const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
          const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

          const response = await axios.post(
            'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
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
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          setFitnessData(response.data);
        } catch (error: any) {
          console.error('Fitness API Error:', error?.response?.data || error);
          
          // Clear tokens if unauthorized
          if (error?.response?.status === 401) {
            localStorage.removeItem('access_token');
            setAccessToken(null);
          }
        }
      }
    };

    handleTokens();

    // Clean up function
    return () => {
      // Any cleanup if needed
    };
  }, [setFitnessData, setAccessToken, setRefreshToken]);

  return <>{children}</>;
};

const MomentumApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body className="bg-[#1a1a1a] text-white">
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>
            <ApolloProvider>
              <FitnessProvider>
                <AuthGuard>
                  <TokenHandler>{children}</TokenHandler>
                </AuthGuard>
              </FitnessProvider>
            </ApolloProvider>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default MomentumApp;
