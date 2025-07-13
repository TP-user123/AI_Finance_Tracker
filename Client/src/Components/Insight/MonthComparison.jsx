const MonthComparison = ({ monthlyStats }) => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Monthly Comparison</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {["credit", "debit"].map((type) => {
          const current = monthlyStats.currentMonth[type] || 0;
          const previous = monthlyStats.previousMonth[type] || 0;
          const diff = current - previous;
          const diffText =
            diff === 0
              ? "No change"
              : diff > 0
              ? `↑ ₹${Math.abs(diff).toLocaleString()} more than last month`
              : `↓ ₹${Math.abs(diff).toLocaleString()} less than last month`;

          return (
            <div
              key={type}
              className={`rounded-lg p-4 border-l-4 shadow-sm ${
                type === "credit"
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <h3 className="text-md font-medium text-gray-700 capitalize">
                {type === "credit" ? "Income" : "Expense"}
              </h3>
              <p className="text-xl font-bold mt-1">₹{current.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">{diffText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthComparison;
