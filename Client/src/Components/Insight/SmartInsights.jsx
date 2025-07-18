import React from "react";
import {
  generateSmartInsights,
} from "../../utils/aiSuggestions"; // make sure this file exists

const SmartInsights = ({ monthlyStats, transactions = [], recurringItems = [] }) => {
  const income = monthlyStats?.currentMonth?.credit || 0;

  const entries = Object.entries(monthlyStats?.currentMonth || {}).filter(
    ([key]) => !["credit", "debit"].includes(key)
  );

  const extraInsights = generateSmartInsights({
    currentMonth: monthlyStats?.currentMonth || {},
    previousMonth: monthlyStats?.previousMonth || {},
    transactions,
    recurringItems,
  });

  if (!income || entries.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Smart Insights</h2>
        <p className="text-gray-600">Smart insights not available due to missing income or categorized expenses.</p>
      </div>
    );
  }

  const sortedEntries = entries
    .map(([category, amount]) => ({
      category,
      amount,
      percent: ((amount / income) * 100).toFixed(1),
    }))
    .sort((a, b) => b.percent - a.percent);

  const generateAdvice = (category, percent) => {
    if (percent >= 90) {
      return `Consider revisiting your priorities—${percent}% of income on ${category} may be excessive.`;
    } else if (percent >= 50) {
      return `That's over half your income spent on ${category}. Look for cost-cutting options.`;
    } else if (percent >= 30) {
      return `Spending on ${category} is noticeable. Any room to trim it a bit?`;
    } else if (percent <= 10) {
      return `👏 Well done! Only ${percent}% went to ${category}.`;
    }
    return null;
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-700 mb-4">💡 Smart AI Insights</h2>

      <ul className="space-y-3">
        {/* Your original insights */}
        {sortedEntries.map(({ category, amount, percent }) => {
          const numeric = parseFloat(percent);
          const advice = generateAdvice(category, numeric);

          if (!advice) return null;

          const bgColor =
            numeric >= 90
              ? "bg-red-100 text-red-800"
              : numeric >= 50
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800";

          return (
            <li key={category} className={`${bgColor} p-4 rounded-md`}>
              💡 <b>{category}:</b> {advice}
            </li>
          );
        })}

        {/* AI-based extra insights */}
        {extraInsights.length > 0 &&
          extraInsights.map((msg, idx) => (
            <li key={"ai-" + idx} className="bg-blue-100 text-blue-800 p-4 rounded-md">
              🧠 {msg}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SmartInsights;
