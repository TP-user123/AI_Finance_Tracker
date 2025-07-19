import { useEffect, useState } from "react";
import axios from "axios";
import CategoryDetailModal from "../Components/CategoryDetailModal"; // ⬅️ Add this import
const apiUrl = import.meta.env.VITE_API_URL;


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
  const [allTxns, setAllTxns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTxns, setCategoryTxns] = useState([]);



useEffect(() => {
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get JWT from localStorage

      const res = await axios.get(`${apiUrl}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔐 Attach token in header
        },
      });

      const transactions = res.data;
      setAllTxns(transactions);

      const expenseTxns = transactions.filter(txn => txn.type === "debit");

      const categoryTotals = {};
      expenseTxns.forEach(txn => {
        const cat = txn.category || "Other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + txn.amount;
      });

      const formatted = Object.entries(categoryTotals).map(([name, amount]) => ({
        name,
        amount,
        color: categoryColors[name] || "#9ca3af",
      }));

      setCategories(formatted);
    } catch (err) {
      console.error("Failed to load category summary:", err);
    }
  };

  fetchCategories();
}, []);

  const handleCategoryClick = (categoryName) => {
    const filtered = allTxns.filter(
      (txn) => txn.category === categoryName && txn.type === "debit"
    );
    setSelectedCategory(categoryName);
    setCategoryTxns(filtered);
  };

  return (
    <div className="bg-white mt-8 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Categories</h2>
      <ul className="divide-y divide-gray-200">
        {categories.length > 0 ? (
          categories.map((cat, i) => (
            <li
              key={i}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded transition"
            >
              <div className="flex items-center space-x-3">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></span>
                <span className="text-gray-700 font-medium">{cat.name}</span>
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

      <CategoryDetailModal
        categoryName={selectedCategory}
        transactions={categoryTxns}
        onClose={() => setSelectedCategory(null)}
      />
    </div>
  );
};

export default CategorySummary;
