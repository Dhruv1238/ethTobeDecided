"use client";

import { FC, useEffect } from "react";
import { useFitness } from "~~/context/FitnessContext";

interface StepComponentProps {
  totalSteps?: number;
}

const StepComponent: FC<StepComponentProps> = ({ totalSteps = 6000 }) => {
  const { fitnessData, fetchFitnessData } = useFitness();

  useEffect(() => {
    fetchFitnessData();
    const interval = setInterval(fetchFitnessData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchFitnessData]);

  // Extract current steps from fitness data
  const currentSteps = fitnessData?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
  const percentage = Math.round((currentSteps / totalSteps) * 100);

  return (
    <div className="flex items-center justify-between w-full rounded-xl bg-[#2d2c2e] p-4">
      <div className="flex flex-col">
        <span className="text-[#fbf8fe] text-4xl font-bold">{currentSteps.toLocaleString()}</span>
        <span className="text-[#a3a2a7] text-lg">/{totalSteps.toLocaleString()} steps</span>
      </div>

      <div className="relative flex items-center">
        <div className="relative w-32 h-3 bg-[#000001] rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#11ce6f] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="absolute -top-8 transition-all duration-300 pointer-events-none"
          style={{ left: `${percentage}%` }}
        >
          <div className="relative bg-[#11ce6f] text-[#fbf8fe] text-xs px-2 py-1 rounded-md -translate-x-1/2">
            {percentage}%
            <div className="absolute h-2 w-2 bg-[#11ce6f] rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepComponent;