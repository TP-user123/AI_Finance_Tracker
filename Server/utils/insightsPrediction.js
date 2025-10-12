// backend/routes/predict.js
const express = require("express");
const router = express.Router();
const Transaction = require("../Model/Transaction");

router.get("/predict", async (req, res) => {
  try {
    const debitTxns = await Transaction.find({ type: "debit" });
    if (!debitTxns.length) {
      return res.json({ message: "No debit transactions found", predictedExpense: 0 });
    }

    const monthlyExpenses = {};
    debitTxns.forEach((txn) => {
      const date = new Date(txn.date);
      if (isNaN(date)) return;
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const key = `${date.getFullYear()}-${month}`;
      monthlyExpenses[key] = (monthlyExpenses[key] || 0) + txn.amount;
    });

    const sortedMonths = Object.keys(monthlyExpenses).sort();
    const data = sortedMonths.map((key, index) => [index, monthlyExpenses[key]]);

    console.log("Monthly Expenses Map:", monthlyExpenses);
    console.log("Sorted Keys:", sortedMonths);
    console.log("Data for Regression:", data);

    if (data.length < 2) {
      return res.json({ message: "Not enough data to predict", predictedExpense: 0 });
    }

    const n = data.length;
    const sumX = data.reduce((sum, val) => sum + val[0], 0);
    const sumY = data.reduce((sum, val) => sum + val[1], 0);
    const sumXY = data.reduce((sum, val) => sum + val[0] * val[1], 0);
    const sumX2 = data.reduce((sum, val) => sum + val[0] * val[0], 0);

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) {
      return res.json({ message: "Regression failed", predictedExpense: 0 });
    }

    const a = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - a * sumX) / n;
    const nextX = n;
    const predictedNextMonth = Math.round(a * nextX + b);

    res.json({
      predictedIncome: 0, // Can replace this later
      predictedExpense: predictedNextMonth,
      message: "Prediction successful",
      monthlyExpenses
    });

  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
