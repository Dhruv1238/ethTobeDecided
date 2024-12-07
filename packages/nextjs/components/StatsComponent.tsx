"use client";

import { FC, useEffect } from "react";
import { useFitness } from "~~/context/FitnessContext";

interface StatsComponentProps {
  stepsGoal?: number;
}

const StatsComponent: FC<StatsComponentProps> = ({ stepsGoal = 8000 }) => {
  const { fitnessData, fetchFitnessData } = useFitness();

  useEffect(() => {
    fetchFitnessData();
    const interval = setInterval(fetchFitnessData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchFitnessData]);

  const steps = fitnessData?.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
  const currentHour = new Date().getHours();
  const calories = Math.round(steps * 0.21);

  return (
    <div className="flex items-center gap-6 w-full rounded-xl bg-[#2d2c2e] p-4">
      <div className="flex flex-col">
        {/* Steps */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#11ce6f]" />
          <div className="flex items-baseline gap-1">
            <span className="text-[#fbf8fe] text-xl font-medium">{steps.toLocaleString()}</span>
            <span className="text-[#a3a2a7] text-sm">steps</span>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <div className="flex items-baseline gap-1">
            <span className="text-[#fbf8fe] text-xl font-medium">{currentHour}</span>
            <span className="text-[#a3a2a7] text-sm">hrs</span>
          </div>
        </div>

        {/* Calories */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ec4899]" />
          <div className="flex items-baseline gap-1">
            <span className="text-[#fbf8fe] text-xl font-medium">{calories}</span>
            <span className="text-[#a3a2a7] text-sm">kcal</span>
          </div>
        </div>
      </div>

      {/* Progress Circles */}
      <div className="w-20 h-full ml-auto">
        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
          {/* Background circles */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#ec489922"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#3b82f622"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#11ce6f22"
            strokeWidth="8"
          />

          {/* Progress circles */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#ec4899"
            strokeWidth="8"
            strokeDasharray={`${(calories / 2000) * 251.2} 251.2`}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={`${(currentHour / 24) * 188.4} 188.4`}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#11ce6f"
            strokeWidth="8"
            strokeDasharray={`${(steps / stepsGoal) * 125.6} 125.6`}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default StatsComponent;