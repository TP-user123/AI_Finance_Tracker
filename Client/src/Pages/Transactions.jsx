import { useState } from "react";

const initialTransactions = [
  { id: 1, date: "2025-07-01", type: "Expense", category: "Food", amount: 25 },
  { id: 2, date: "2025-07-02", type: "Income", category: "Salary", amount: 500 },
  { id: 3, date: "2025-07-03", type: "Expense", category: "Transport", amount: 15 },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    date: "",
    type: "",
    category: "",
    amount: "",
  });

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleEdit = (txn) => {
    setFormData(txn);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ id: null, date: "", type: "", category: "", amount: "" });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setTransactions(transactions.map((t) => (t.id === formData.id ? formData : t)));
    } else {
      setTransactions([...transactions, { ...formData, id: Date.now() }]);
    }
    setShowForm(false);
  };

  const filtered = transactions.filter((t) =>
    `${t.date} ${t.type} ${t.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>

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

      {/* Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl shadow-md p-5 border-l-4 transition hover:shadow-lg hover:border-blue-500"
            style={{
              borderColor: t.type === "Income" ? "#10b981" : "#ef4444",
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">{t.date}</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  t.type === "Income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {t.type}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{t.category}</h3>
            <p className="text-xl font-bold text-gray-900 mt-1">₹{t.amount.toLocaleString()}</p>
            <div className="flex justify-end mt-4 space-x-3 text-sm">
              <button
                onClick={() => handleEdit(t)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
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
        {formData.id ? "Edit Transaction" : "Add New Transaction"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            placeholder="e.g. Food, Rent, Transport"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {formData.id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Transactions;