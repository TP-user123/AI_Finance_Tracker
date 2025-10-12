import React from "react";

const GoalProgressBar = ({ current, target }) => {
  const progress = Math.min((current / target) * 100, 100);
  return (
    <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
      <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default GoalProgressBar;
