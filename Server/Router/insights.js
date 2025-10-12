const express = require("express");
const router = express.Router();
const Transaction = require("../Model/Transaction");
const { classifyCategory } = require("../utils/categoryClassifier");

// Existing category comparison route
router.get("/", async (req, res) => {
  try {
    const allTransactions = await Transaction.find({ userId: req.user._id });

    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const currentMonth = {};
    const previousMonth = {};

    allTransactions.forEach((txn) => {
      const date = new Date(txn.date);
      const category = txn.category || classifyCategory(txn.description);
      const amount = txn.type === "debit" ? txn.amount : 0;

      const isThisMonth = date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      const isLastMonth = date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;

      if (isThisMonth) {
        currentMonth[category] = (currentMonth[category] || 0) + amount;
      }

      if (isLastMonth) {
        previousMonth[category] = (previousMonth[category] || 0) + amount;
      }
    });

    res.json({ currentMonth, previousMonth });
  } catch (err) {
    console.error("Insights error:", err);
    res.status(500).json({ message: "Failed to load insights." });
  }
});

// New: Monthly trend analysis route
router.get("/monthly-stats", async (req, res) => {
  try {
    const userId = req.user._id;

    const monthlyStats = await Transaction.aggregate([
      {
        $match: { userId }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(monthlyStats);
  } catch (error) {
    console.error("Error in /monthly-stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
