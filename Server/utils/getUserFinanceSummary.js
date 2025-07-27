const Transaction = require("../Model/Transaction"); // Assuming you have a Transaction model

async function getUserFinanceSummary(userId) {
  const transactions = await Transaction.find({ user: userId });

  const summary = {
    income: 0,
    expense: 0,
    byCategory: {},
  };

  for (const txn of transactions) {
    if (txn.type === "income") summary.income += txn.amount;
    else {
      summary.expense += txn.amount;
      const cat = txn.category || "Other";
      summary.byCategory[cat] = (summary.byCategory[cat] || 0) + txn.amount;
    }
  }

  return `
Income: ₹${summary.income}
Expense: ₹${summary.expense}
Top Categories:
${Object.entries(summary.byCategory)
  .map(([cat, val]) => `- ${cat}: ₹${val}`)
  .join("\n")}
  `;
}

module.exports = getUserFinanceSummary;
