import { useEffect, useState } from "react";
import axios from "axios";  
import { toast } from "react-toastify";
import LoadingButton from "../Components/LoadingButton";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [filterType, setFilterType] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    date: "",
    type: "",
    category: "",
    amount: "",
  });

  // 🟢 Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🟢 Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchTransactions(); // refresh
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // 🟢 Edit
  const handleEdit = (txn) => {
  setFormData({
    _id: txn._id,
    date: txn.date,
    type: txn.type,
    category: txn.category, // ✅ This must match exactly
    amount: txn.amount,
    description: txn.description || "",
  });
  setShowForm(true);
};


  // 🟢 Add
  const handleAdd = () => {
    setFormData({ _id: null, date: "", type: "", category: "", amount: "" });
    setShowForm(true);
  };

  // 🟢 Submit (Add or Update)

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const newTxn = {
    ...formData,
    amount: parseFloat(formData.amount),
    description: formData.description || "",
  };

  try {
    if (formData._id) {
      await axios.put(`http://localhost:5000/api/transactions/${formData._id}`, newTxn);
      toast.success("Transaction updated!");
    } else {
      await axios.post("http://localhost:5000/api/transactions", newTxn);
      toast.success("Transaction added!");
    }

    setFormData({
      date: "",
      type: "",
      category: "",
      amount: "",
      description: "",
    });

    fetchTransactions();
    setShowForm(false); // ✅ Auto-close modal after save
  } catch (err) {
    toast.error("Failed to save transaction");
    console.error("Save failed:", err);
  } finally {
    setIsSubmitting(false);
  }
};

  // 🧠 Filter
  let filtered = [...transactions];

  // Search filter
  filtered = filtered.filter((t) =>
    `${t.date} ${t.type} ${t.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Type filter
  if (filterType) {
    filtered = filtered.filter((t) => t.type === filterType);
  }

  // Month filter
  if (filterMonth) {
    filtered = filtered.filter(
      (t) => new Date(t.date).getMonth() + 1 === parseInt(filterMonth)
    );
  }

  // Sorting
  if (sortBy === "latest") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "amountDesc") {
    filtered.sort((a, b) => b.amount - a.amount);
  } else if (sortBy === "amountAsc") {
    filtered.sort((a, b) => a.amount - b.amount);
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>
      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by date, type or category..."
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Transaction
        </button>
      </div>
      {/* Filters & Sorting */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <select
            className="border px-3 py-1 rounded-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="amountDesc">Amount: High to Low</option>
            <option value="amountAsc">Amount: Low to High</option>
          </select>

          <select
            className="border px-3 py-1 rounded-md"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="credit">Income</option>
            <option value="debit">Expense</option>
          </select>

          <select
            className="border px-3 py-1 rounded-md"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <div
            key={t._id}
            className={`bg-white rounded-xl shadow-md p-5 border-l-4 transition hover:shadow-lg ${
              t.type === "credit" ? "border-green-500" : "border-red-500"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {new Date(t.date).toLocaleDateString("en-IN", {
                  weekday: "short", // 👈 Adds "Mon", "Tue", etc.
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>

              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  t.type === "credit"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {t.type}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              {t.category}
            </h3>

            <p
              className={`text-xl font-bold mt-1 ${
                t.type === "credit" ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{t.amount.toLocaleString()}
            </p>

            <div className="flex justify-end mt-4 space-x-3 text-sm">
              <button
                onClick={() => handleEdit(t)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-10">
            No transactions found.
          </p>
        )}
      </div>
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              {formData._id ? "Edit Transaction" : "Add New Transaction"}
            </h2>

            {/* 🔁 Show loading when form is submitting */}
            {isSubmitting ? (
              <div className="text-center py-6">
                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">Saving...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.date
                        ? new Date(formData.date).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="credit">Income</option>
                    <option value="debit">Expense</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {[
                      "Food",
                      "Rent",
                      "Transport",
                      "Shopping",
                      "Utilities",
                      "Entertainment",
                      "Other",
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 🔤 Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Uber ride, Salary, Grocery"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* ₹ Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                 <LoadingButton type="submit" isLoading={isSubmitting}>
  {formData._id ? "Update" : "Save"}
</LoadingButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      ;
    </div>
  );
};

export default Transactions;
