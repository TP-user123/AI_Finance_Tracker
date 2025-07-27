const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const authenticateUser = require("../Middleware/authMiddleware");

// 🟡 Helper function to calculate next due date
const calculateNextDueDate = (currentDate, frequency) => {
  const date = new Date(currentDate);
  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
};

// ✅ Route: Get recurring items
router.get("/", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const items = user.spendingLimit.expectedRecurringList || [];
    res.json({ items });
  } catch (err) {
    console.error("❌ Error fetching recurring items:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/markdone", authenticateUser, async (req, res) => {
  const { itemId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const recurringList = user.spendingLimit.expectedRecurringList;

    // Find the correct index
    const index = recurringList.findIndex((item) => item._id.toString() === itemId);
    if (index === -1) return res.status(404).json({ message: "Recurring item not found" });

    const item = recurringList[index];

    // Update status and completedOn
    item.status = item.frequency && item.frequency !== "none" ? "pending" : "done";
    item.completedOn = new Date();

    // Update nextDueDate if recurring
    if (item.frequency && item.frequency !== "none") {
      const nextDate = new Date(item.date || Date.now());
      switch (item.frequency) {
        case "daily":
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case "weekly":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "monthly":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case "yearly":
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }
      item.nextDueDate = nextDate;
    }

    // Force Mongoose to detect changes
    user.markModified("spendingLimit.expectedRecurringList");

    await user.save();

    res.status(200).json({ message: "Recurring item updated", item });
  } catch (error) {
    console.error("❌ Error updating recurring item:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
