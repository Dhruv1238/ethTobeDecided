"use client";

import React from "react";
import { FaDumbbell, FaTimes } from "react-icons/fa";
import { MdHelpOutline } from "react-icons/md";

const Streak: React.FC = () => {
  const week = [
    { day: "Mon", finished: "true" },
    { day: "Tue", finished: "false" },
    { day: "Wed", finished: "true" },
    { day: "Thu", finished: "true" },
    { day: "Fri", finished: "early" },
    { day: "Sat", finished: "early" },
    { day: "Sun", finished: "early" },
  ];

  return (
    <div className="p-5 bg-accent/20 w-full rounded-lg shadow-lg transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-base-content">Your Streak</h2>
        <div className="flex items-center gap-2">
          <span className="text-lg text-warning">1X</span>
          <MdHelpOutline size={22} className="text-base-content" />
        </div>
      </div>
      <div className="p-3 rounded-lg">
        <div className="flex justify-between mb-4">
          {week.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="text-sm font-semibold text-neutral-content">{day.day}</span>
              {day.finished === "true" ? (
                <div className="w-9 h-9 rounded-full flex justify-center items-center bg-success shadow-md">
                  <FaDumbbell size={20} className="text-white" />
                </div>
              ) : day.finished === "false" ? (
                <div className="w-9 h-9 rounded-full flex justify-center items-center bg-error shadow-md">
                  <FaTimes size={20} className="text-white" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full flex justify-center items-center bg-neutral shadow-md">
                  <span className="text-white text-lg">-</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-base text-base-content">Current Streak</span>
          <span className="text-base font-bold text-warning">2 Days</span>
        </div>
        <div>
          <span className="text-sm text-neutral-content">
            5 more days to earn a <span className="text-warning">1.3X</span> on PUMP rewards
          </span>
        </div>
      </div>
    </div>
  );
};

export default Streak;