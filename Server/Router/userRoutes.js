const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const authenticateUser = require("../Middleware/authMiddleware");

// ✅ GET /api/user/limits
router.get("/limits", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const spendingLimit = user.spendingLimit || {};

    res.json({
      monthly: spendingLimit.monthly || 0,
      categories: spendingLimit.categories || {},
      expectedRecurringList: spendingLimit.expectedRecurringList || [],
    });
  } catch (err) {
    console.error("❌ GET /limits error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT /api/user/limits
router.put("/limits", authenticateUser, async (req, res) => {
  try {
    const { monthly, categories, expectedRecurringList } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.spendingLimit) user.spendingLimit = {};

    if (monthly !== undefined) user.spendingLimit.monthly = monthly;

    if (categories) {
      user.spendingLimit.categories = {
        ...user.spendingLimit.categories,
        ...categories,
      };
    }

    if (Array.isArray(expectedRecurringList)) {
  const formattedItems = expectedRecurringList.map(item => {
    const { source, amount, type, date, frequency, autoAdd } = item;

    return {
      source: source || "",
      amount: Number(amount) || 0,
      type: type === "expense" ? "expense" : "income",
      date: date || new Date().toISOString(),
      frequency: typeof frequency === "string" ? frequency : "none",
      autoAdd: !!autoAdd
    };
  });

  // ✅ Instead of overwriting, append to existing list
  if (!Array.isArray(user.spendingLimit.expectedRecurringList)) {
    user.spendingLimit.expectedRecurringList = [];
  }

  user.spendingLimit.expectedRecurringList.push(...formattedItems);
}


    await user.save();

    res.json({
      message: "Spending limits updated",
      spendingLimit: user.spendingLimit,
    });
  } catch (err) {
    console.error("❌ PUT /limits error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/recurring/undodone", authenticateUser, async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const item = user.spendingLimit.expectedRecurringList.id(id);
  if (!item) return res.status(404).json({ message: "Recurring item not found" });

  item.status = "pending";
  item.completedOn = null;

  await user.save();
  res.json({ message: "Recurring item reset to pending", item });
});


//delete the expectedRecurringList 
// DELETE a recurring item by ID
router.delete("/delete/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const list = user.spendingLimit.expectedRecurringList;
  const index = list.findIndex((item) => item._id.toString() === id);

  if (index === -1)
    return res.status(404).json({ message: "Recurring item not found" });

  list.splice(index, 1); // Remove the item
  await user.save();

  res.json({ message: "Recurring item deleted successfully" });
});


module.exports = router;
