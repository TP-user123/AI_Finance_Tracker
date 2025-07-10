import { useEffect, useState } from "react";
import axios from "axios";

// Optional: assign fixed colors to categories
const categoryColors = {
  Food: "#ef4444",
  Rent: "#3b82f6",
  Transport: "#facc15",
  Shopping: "#10b981",
  Utilities: "#8b5cf6",
  Entertainment: "#f97316",
  TopUp: "#14b8a6",
  Income: "#22c55e",
  Other: "#9ca3af",
};

const CategorySummary = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transactions");
        const transactions = res.data;

        // Filter only debit (expenses)
        const expenseTxns = transactions.filter(txn => txn.type === "debit");

        // Group by category and sum amounts
        const categoryTotals = {};
        expenseTxns.forEach(txn => {
          const cat = txn.category || "Other";
          categoryTotals[cat] = (categoryTotals[cat] || 0) + txn.amount;
        });

        // Convert to array format with color mapping
        const formatted = Object.entries(categoryTotals).map(([name, amount]) => ({
          name,
          amount,
          color: categoryColors[name] || "#9ca3af", // default gray
        }));

        setCategories(formatted);
      } catch (err) {
        console.error("Failed to load category summary:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white mt-8 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Categories</h2>
      <ul className="divide-y divide-gray-200">
        {categories.length > 0 ? (
          categories.map((cat, i) => (
            <li key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></span>
                <span className="text-gray-700">{cat.name}</span>
              </div>
              <span className="font-semibold text-gray-900">
                ₹{cat.amount.toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">Loading categories...</p>
        )}
      </ul>
    </div>
  );
};

export default CategorySummary;
