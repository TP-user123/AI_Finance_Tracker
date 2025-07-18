// src/utils/aiSuggestions.js

export function suggestCostCuts(currentMonth, previousMonth) {
  const suggestions = [];

  Object.entries(currentMonth).forEach(([category, amount]) => {
    if (["credit", "debit", "Income"].includes(category)) return;

    const prevAmount = previousMonth[category] || 0;
    const increase = amount - prevAmount;
    const increasedBy = ((increase / (prevAmount || 1)) * 100).toFixed(1);

    if (increase > 0 && increasedBy > 20) {
      suggestions.push(
        `Consider reducing spending in ${category}, which increased by ${increasedBy}% compared to last month.`
      );
    }
  });

  return suggestions;
}

export function detectSpikes(transactions) {
  const threshold = 5000; // Adjust as needed
  const spikes = transactions.filter(
    (tx) => tx.amount > threshold && tx.type === "expense"
  );

  return spikes.map(
    (tx) =>
      `Unusually high spending: ₹${tx.amount} on ${tx.category} (${new Date(
        tx.date
      ).toDateString()})`
  );
}

export function upcomingRecurringAlerts(recurringItems) {
  const today = new Date();
  const alerts = [];

  recurringItems.forEach((item) => {
    const dueDate = new Date(item.nextDue); // Must store this in DB
    const daysLeft = (dueDate - today) / (1000 * 60 * 60 * 24);

    if (daysLeft > 0 && daysLeft <= 5) {
      alerts.push(
        `Reminder: Your recurring bill for ${item.source} is due on ${dueDate.toDateString()}.`
      );
    }
  });

  return alerts;
}

export function generateSmartInsights({
  currentMonth,
  previousMonth,
  transactions,
  recurringItems,
}) {
  const costSuggestions = suggestCostCuts(currentMonth, previousMonth);
  const spikes = detectSpikes(transactions);
  const alerts = upcomingRecurringAlerts(recurringItems);

  return [...alerts, ...spikes, ...costSuggestions];
}
