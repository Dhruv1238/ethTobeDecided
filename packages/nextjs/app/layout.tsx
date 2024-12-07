"use client";

import { useEffect } from "react";
import axios from "axios";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { ApolloProvider } from "~~/context/ApolloProvider";
import { FitnessProvider, useFitness } from "~~/context/FitnessContext";
import "~~/styles/globals.css";

const TokenHandler = ({ children }: { children: React.ReactNode }) => {
  const { setFitnessData, setAccessToken } = useFitness();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const idToken = urlParams.get('id_token');
    const refreshToken = urlParams.get('refresh_token');

    if (accessToken || idToken || refreshToken) {
      console.log('Access Token:', accessToken);
      console.log('ID Token:', idToken);
      console.log('Refresh Token:', refreshToken);
      
      localStorage.setItem('access_token', accessToken || '');
      localStorage.setItem('id_token', idToken || '');
      localStorage.setItem('refresh_token', refreshToken || '');

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
              dataTypeName: "com.google.step_count.delta"
            }
          ],
          startTimeMillis: startOfDay,
          endTimeMillis: endOfDay,
          bucketByTime: {
            durationMillis: 86400000 // 24 hours in milliseconds
          }
        };

        try {
          const response = await axios.post(
            'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
            data,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('Fitness Data:', JSON.stringify(response.data));
          setFitnessData(response.data);
        } catch (error) {
          console.error('Fitness API Error:', error);
        }
      };

      fetchFitnessData();
    }
  }, [setFitnessData, setAccessToken]);

  return <>{children}</>;
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>
            <ApolloProvider>
              <FitnessProvider>
                <TokenHandler>
                  {children}
                </TokenHandler>
              </FitnessProvider>
            </ApolloProvider>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;