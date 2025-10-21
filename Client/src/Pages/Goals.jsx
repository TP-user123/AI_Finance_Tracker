import React, { useState, useEffect, lazy, Suspense } from "react";
import Swal from "sweetalert2";
import { getGoals, deleteGoal, markGoalComplete } from "../Components/Goals/goalService";
const GoalCard = lazy(() => import("../Components/Goals/GoalCard"));
const AddGoalModal = lazy(() => import("../Components/Goals/AddGoalModal"));


const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // fetch goals
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddClick = () => {
    setSelectedGoal(null);
    setShowModal(true);
  };

  const handleEditClick = (goal) => {
    setSelectedGoal(goal);
    setShowModal(true);
  };

  const handleGoalSaved = (savedGoal) => {
    const exists = goals.find((g) => g._id === savedGoal._id);
    if (exists) {
      setGoals(goals.map((g) => (g._id === savedGoal._id ? savedGoal : g)));
    } else {
      setGoals([...goals, savedGoal]);
    }
  };

  // 🗑️ Delete goal
  const handleDeleteGoal = async (id) => {
  const result = await Swal.fire({
    title: "Delete Goal?",
    text: "Are you sure you want to delete this goal? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteGoal(id);
    setGoals(goals.filter((g) => g._id !== id));

    Swal.fire("Deleted!", "Your goal has been deleted.", "success");
  } catch (err) {
    console.error("Error deleting goal:", err);
    Swal.fire("Error", "Failed to delete goal.", "error");
  }
};


  // ✅ Complete goal
 const handleCompleteGoal = async (id) => {
  const result = await Swal.fire({
    title: "Mark Goal as Completed?",
    text: "Once marked complete, progress will be locked.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, complete it!",
  });

  if (!result.isConfirmed) return;

  try {
    const updatedGoal = await markGoalComplete(id);
    setGoals(goals.map((g) => (g._id === id ? updatedGoal : g)));

    Swal.fire("Completed!", "Goal has been marked as completed. 🎯", "success");
  } catch (err) {
    console.error("Error completing goal:", err);
    Swal.fire("Error", "Failed to complete goal.", "error");
  }
};

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Goals</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Goal
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading goals...</p>}

      {/* No goals */}
      {!loading && goals.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No goals yet. Add a goal to get started!
        </p>
      )}

      {/* Goals list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Suspense fallback={<p>Loading...</p>}>
          {goals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onEdit={() => handleEditClick(goal)}
              onDelete={() => handleDeleteGoal(goal._id)}
              onComplete={handleCompleteGoal}
            />
          ))}
        </Suspense>
      </div>

      {/* Add/Edit Goal Modal */}
      {showModal && (
        <Suspense fallback={<p>Loading modal...</p>}>
          <AddGoalModal
            goal={selectedGoal}
            onClose={() => setShowModal(false)}
            onGoalSaved={handleGoalSaved}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Goals;
