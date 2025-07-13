const CategoryInsights = ({ transactions, selectedMonth, selectedYear }) => {
  const categoryTotals = {};

  transactions.forEach((txn) => {
    const date = new Date(txn.date);
    if (
      date.getMonth() + 1 === selectedMonth &&
      date.getFullYear() === selectedYear &&
      txn.type === "debit"
    ) {
      categoryTotals[txn.category] =
        (categoryTotals[txn.category] || 0) + parseFloat(txn.amount);
    }
  });

  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Category Insights</h2>
      <ul className="space-y-2">
        {sorted.map(([category, amount]) => (
          <li key={category} className="bg-blue-50 p-3 rounded shadow text-blue-900">
            💡 <b>{category}</b>: ₹{amount.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryInsights;
