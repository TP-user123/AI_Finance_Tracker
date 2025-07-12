const express = require("express");
const router = express.Router();
const Transaction = require('../Model/Transaction');
const { classifyCategory } = require("../utils/categoryClassifier");

router.get("/", async (req, res) => {
  try {
    const allTransactions = await Transaction.find();

    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Initialize category maps
    const currentMonth = {};
    const previousMonth = {};

    allTransactions.forEach((txn) => {
      const date = new Date(txn.date);
      const category = txn.category || classifyCategory(txn.description);
      const amount = txn.type === "debit" ? txn.amount : 0; // Only expenses

      const isThisMonth =
        date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      const isLastMonth =
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;

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

module.exports = router;
