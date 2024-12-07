"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

interface FitnessContextType {
  fitnessData: any;
  setFitnessData: (data: any) => void;  // Add this line
  fetchFitnessData: () => Promise<void>;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export function FitnessProvider({ children }: { children: React.ReactNode }) {
  const [fitnessData, setFitnessData] = useState(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const fetchFitnessData = useCallback(async () => {
    if (!accessToken) return;

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

    const data = {
      aggregateBy: [{
        dataTypeName: "com.google.step_count.delta"
      }],
      startTimeMillis: startOfDay,
      endTimeMillis: endOfDay,
      bucketByTime: {
        durationMillis: 86400000
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
      setFitnessData(response.data);
    } catch (error) {
      console.error('Error fetching fitness data:', error);
    }
  }, [accessToken]);

  return (
    <FitnessContext.Provider value={{ 
      fitnessData, 
      fetchFitnessData, 
      setFitnessData,
      accessToken, 
      setAccessToken 
    }}>
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}