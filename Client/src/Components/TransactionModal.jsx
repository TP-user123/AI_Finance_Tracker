import React from "react";
import LoadingButton from "./LoadingButton";

const TransactionModal = ({
  showForm,
  setShowForm,
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          {formData._id ? "Edit Transaction" : "Add New Transaction"}
        </h2>

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

            {/* Description */}
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

            {/* Amount */}
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
  );
};

export default TransactionModal;
