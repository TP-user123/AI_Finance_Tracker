const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const authenticateUser = require("../middleware/authMiddleware");

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
// routes/userRoutes.js

router.put("/limits", authenticateUser, async (req, res) => {
  try {
    const { monthly, categories, expectedRecurringList } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure spendingLimit exists
    if (!user.spendingLimit) user.spendingLimit = {};

    if (monthly !== undefined) user.spendingLimit.monthly = monthly;

    if (categories) {
      user.spendingLimit.categories = {
        ...user.spendingLimit.categories,
        ...categories,
      };
    }

    if (Array.isArray(expectedRecurringList)) {
      user.spendingLimit.expectedRecurringList = expectedRecurringList;
    }

    await user.save();

    res.json({
      message: "Spending limits updated",
      spendingLimit: user.spendingLimit,
    });
  } catch (err) {
    console.error("PUT /limits error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
