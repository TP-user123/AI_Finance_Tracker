import React, { useState, useEffect, lazy, Suspense } from "react";
import { getGoals } from "../Components/Goals/goalService";
const GoalCard = lazy(() => import("../Components/Goals/GoalCard"));
const AddGoalModal = lazy(() => import("../Components/Goals/AddGoalModal"));

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null); // track goal to edit

  // fetch goals
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddClick = () => {
    setSelectedGoal(null); // null = create new
    setShowModal(true);
  };

  const handleEditClick = (goal) => {
    setSelectedGoal(goal); // pass goal to edit
    setShowModal(true);
  };

  const handleGoalSaved = (savedGoal) => {
    // Update state after create or update
    const exists = goals.find((g) => g._id === savedGoal._id);
    if (exists) {
      setGoals(goals.map((g) => (g._id === savedGoal._id ? savedGoal : g)));
    } else {
      setGoals([...goals, savedGoal]);
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
        <p className="text-gray-500 text-center mt-10">No goals yet. Add a goal to get started!</p>
      )}

      {/* Goals list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Suspense fallback={<p>Loading...</p>}>
          {goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} onEdit={() => handleEditClick(goal)} />
          ))}
        </Suspense>
      </div>

      {/* Add/Edit Goal Modal */}
      {showModal && (
        <Suspense fallback={<p>Loading modal...</p>}>
          <AddGoalModal
            goal={selectedGoal} // null for new, goal object for edit
            onClose={() => setShowModal(false)}
            onGoalSaved={handleGoalSaved}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Goals;
