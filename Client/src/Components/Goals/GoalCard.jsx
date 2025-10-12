import React from "react";
import GoalProgressBar from "./GoalProgressBar";

const GoalCard = ({ goal, onEdit, onDelete, onComplete }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col gap-3">
      <h3 className="font-semibold text-lg">{goal.title}</h3>
      <p className="text-sm text-gray-500">{goal.category}</p>
      <GoalProgressBar current={goal.currentAmount} target={goal.targetAmount} />
      <p className="text-sm text-gray-600 mt-1">
        ₹{goal.currentAmount} / ₹{goal.targetAmount}
      </p>
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onEdit} className="text-blue-600 hover:underline text-sm">Edit</button>
        <button onClick={onDelete} className="text-red-500 hover:underline text-sm">Delete</button>
        {goal.status !== "completed" && (
          <button onClick={() => onComplete(goal._id)} className="text-green-600 hover:underline text-sm">
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
