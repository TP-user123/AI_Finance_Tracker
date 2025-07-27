export function generateAISummary(currentMonth, previousMonth) {
  const credit = currentMonth.credit || 0;
  const debit = currentMonth.debit || 0;
  const savings = credit - debit;
  const prevDebit = previousMonth.debit || 0;
  const spendDiff = debit - prevDebit;

  const topCategory = Object.entries(currentMonth)
    .filter(([key]) => !["credit", "debit"].includes(key))
    .sort((a, b) => b[1] - a[1])[0];

  const summaryParts = [];

  summaryParts.push(
    `You earned ₹${credit.toLocaleString()} and spent ₹${debit.toLocaleString()} this month.`
  );

  if (topCategory) {
    summaryParts.push(
      `Your highest spending was on **${topCategory[0]}**, totaling ₹${topCategory[1].toLocaleString()}.`
    );
  }

  summaryParts.push(
    savings >= 0
      ? `You managed to save ₹${savings.toLocaleString()} this month.`
      : `You overspent by ₹${Math.abs(savings).toLocaleString()}.`
  );

  if (spendDiff > 0) {
    summaryParts.push(
      `Spending increased by ₹${spendDiff.toLocaleString()} compared to last month.`
    );
  } else if (spendDiff < 0) {
    summaryParts.push(
      `Great job! You reduced your spending by ₹${Math.abs(spendDiff).toLocaleString()} compared to last month.`
    );
  } else {
    summaryParts.push(`Your spending remained consistent with last month.`);
  }

  return summaryParts.join(" ");
}
