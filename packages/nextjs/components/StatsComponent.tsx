import { FC } from "react";

interface StatsComponentProps {
  steps: number;
  minutes: number;
  calories: number;
  stepsGoal?: number;
}

const StatsComponent: FC<StatsComponentProps> = ({ steps, minutes, calories, stepsGoal = 6000 }) => {
  return (
    <div className="flex items-center gap-6 w-full rounded-xl bg-[#2d2c2e] p-4">
      <div className="flex flex-col ">
        {/* Steps */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#11ce6f]" />
          <div className="flex items-baseline gap-1">
            <span className="text-[#fbf8fe] text-xl font-medium">{steps.toLocaleString()}</span>
            <span className="text-[#a3a2a7] text-sm">steps</span>
          </div>
        </div>

        {/* Minutes */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <div className="flex items-baseline gap-1">
            <span className="text-[#fbf8fe] text-xl font-medium">{minutes}</span>
            <span className="text-[#a3a2a7] text-sm">mins</span>
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

      {/* Heart Progress Indicator */}
      <div className=" w-20 h-full ml-auto">
        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
          {/* Pink circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#ec4899"
            strokeWidth="8"
            strokeDasharray={`${(calories / 100) * 251.2} 251.2`}
            className="opacity-20"
          />
          {/* Blue circle */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={`${(minutes / 30) * 188.4} 188.4`}
            className="opacity-20"
          />
          {/* Green circle */}
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#11ce6f"
            strokeWidth="8"
            strokeDasharray={`${(steps / stepsGoal) * 125.6} 125.6`}
            className="opacity-20"
          />
        </svg>
      </div>
    </div>
  );
};

export default StatsComponent;
