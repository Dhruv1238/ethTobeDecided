import { FC } from "react";

interface StepComponentProps {
  currentSteps: number;
  totalSteps: number;
}

const StepComponent: FC<StepComponentProps> = ({ currentSteps, totalSteps }) => {
    const percentage = Math.round((currentSteps / totalSteps) * 100);
  
    return (
      <div className="flex items-center justify-between w-full rounded-xl bg-[#2d2c2e] p-4">
        <div className="flex flex-col">
          <span className="text-[#fbf8fe] text-2xl font-bold">
            {currentSteps.toLocaleString()}
          </span>
          <span className="text-[#a3a2a7] text-sm">/{totalSteps.toLocaleString()} steps</span>
        </div>
        
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full bg-[#000001]" />
          <div 
            className="absolute inset-1 rounded-full bg-[#2d2c2e]"
            style={{
              background: `conic-gradient(
                #b6b7bb ${percentage}%,
                #2d2c2e ${percentage}%
              )`
            }}
          />
        </div>
      </div>
    );
  };

export default StepComponent;