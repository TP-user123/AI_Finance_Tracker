import Goal from "../Model/Goal.js";
import { calculateProgress } from "../utils/calculateProgress.js";


// Create a new goal
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline, category } = req.body;

    // Validate required fields
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ success: false, message: "Title, target amount and deadline are required" });
    }

    // Validate numbers
    if (targetAmount <= 0 || currentAmount < 0) {
      return res.status(400).json({ success: false, message: "Target and current amounts must be non-negative" });
    }

    const goal = await Goal.create({
      userId: req.userId, // ✅ corrected from req.user_Id
      title,
      targetAmount,
      currentAmount,
      deadline,
      category,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    console.error("Error in createGoal:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all goals for a user
export const getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    const goalsWithProgress = goals.map((goal) => ({
      ...goal._doc,
      progress: calculateProgress(goal.currentAmount, goal.targetAmount),
    }));
    res.json({ success: true, data: goalsWithProgress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a goal (edit details or add savings)
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOne({ _id: id, userId: req.userId });
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });

    Object.assign(goal, req.body); // merge updates
    await goal.save();

    res.json({ success: true, data: goal });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOneAndDelete({ _id: id, userId: req.userId });
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });

    res.json({ success: true, message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark a goal as completed or failed
export const markGoalComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected values: "completed" or "failed"

    // Validate status
    if (!["completed", "failed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    // Make sure req.user.id exists (depends on your auth middleware)
    const userId = req.user?.id || req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    // Find the goal by id and user ownership
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    // Update goal status
    goal.status = status;
    await goal.save();

    return res.status(200).json({ success: true, data: goal });
  } catch (err) {
    console.error("Error updating goal status:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

