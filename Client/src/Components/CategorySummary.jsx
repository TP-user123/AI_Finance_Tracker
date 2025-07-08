const categories = [
  { name: "Food", amount: 450, color: "#ef4444" },
  { name: "Rent", amount: 900, color: "#3b82f6" },
  { name: "Transport", amount: 200, color: "#facc15" },
  { name: "Shopping", amount: 300, color: "#10b981" },
];

const CategorySummary = () => {
  return (
    <div className="bg-white mt-8 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Categories</h2>
      <ul className="divide-y divide-gray-200">
        {categories.map((cat, i) => (
          <li key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              ></span>
              <span className="text-gray-700">{cat.name}</span>
            </div>
            <span className="font-semibold text-gray-900">₹{cat.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySummary;