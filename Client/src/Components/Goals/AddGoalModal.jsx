import React, { useState, useEffect } from "react";
import { createGoal, updateGoal } from "./goalService";

const AddGoalModal = ({ onClose, onGoalSaved, goal }) => {
  const [title, setTitle] = useState(goal?.title || "");
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || "");
  const [currentAmount, setCurrentAmount] = useState(goal?.currentAmount || 0);
  const [deadline, setDeadline] = useState(goal?.deadline || "");
  const [category, setCategory] = useState(goal?.category || "General");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [monthlySavings, setMonthlySavings] = useState(0);

  const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD

  // Calculate monthly savings dynamically
  useEffect(() => {
    if (targetAmount && deadline) {
      const now = new Date();
      const end = new Date(deadline);
      const months =
        end.getFullYear() * 12 +
        end.getMonth() -
        (now.getFullYear() * 12 + now.getMonth()) +
        1;
      if (months > 0) {
        const savings = Math.max(0, (targetAmount - currentAmount) / months);
        setMonthlySavings(savings.toFixed(2));
      } else {
        setMonthlySavings(0);
      }
    } else {
      setMonthlySavings(0);
    }
  }, [targetAmount, currentAmount, deadline]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    if (targetAmount === "" || targetAmount < 0)
      errs.targetAmount = "Target amount must be non-negative";
    if (currentAmount < 0) errs.currentAmount = "Current amount must be non-negative";
    if (!deadline) errs.deadline = "Deadline is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);

    try {
      let savedGoal;
      if (goal && typeof goal._id !== "undefined") {
        // Update existing goal
        savedGoal = await updateGoal(goal._id, {
          title,
          targetAmount,
          currentAmount,
          deadline,
          category,
        });
      } else {
        // Create new goal
        savedGoal = await createGoal({
          title,
          targetAmount,
          currentAmount,
          deadline,
          category,
        });
      }

      onGoalSaved(savedGoal);
      onClose();
    } catch (err) {
      console.error("Goal save error:", err);
      alert("Failed to save goal");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h3 className="text-2xl font-semibold mb-4">{goal ? "Edit Goal" : "Add New Goal"}</h3>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="font-medium">Goal Title</label>
          <input
            type="text"
            placeholder="Enter goal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}

          <label className="font-medium">Target Amount</label>
          <input
            type="number"
            placeholder="Enter target amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className="border p-2 rounded"
          />
          {errors.targetAmount && <span className="text-red-500 text-sm">{errors.targetAmount}</span>}

          <label className="font-medium">Current Amount</label>
          <input
            type="number"
            placeholder="Enter current amount"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(Number(e.target.value))}
            className="border p-2 rounded"
          />
          {errors.currentAmount && <span className="text-red-500 text-sm">{errors.currentAmount}</span>}

          <label className="font-medium">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={today} // disable past dates
            className="border p-2 rounded"
          />
          {errors.deadline && <span className="text-red-500 text-sm">{errors.deadline}</span>}

          <label className="font-medium">Category</label>
          <input
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          />

          {/* Monthly savings info */}
          {monthlySavings > 0 && (
            <p className="text-gray-600 text-sm mt-2">
              You need to save <span className="font-semibold">₹{monthlySavings}</span> per month to reach your goal.
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-3"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Goal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
