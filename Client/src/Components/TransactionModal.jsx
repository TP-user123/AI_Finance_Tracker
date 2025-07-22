import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingButton from "./LoadingButton";

const apiUrl = import.meta.env.VITE_API_URL;

const TransactionModal = ({
  showForm,
  setShowForm,
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
}) => {
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [customCategories, setCustomCategories] = useState({ debit: [], credit: [] });

  const token = localStorage.getItem("token");

  const defaultCategories = [
    "Food",
    "Rent",
    "Utilities",
    "Shopping",
    "Entertainment",
    "Income",
  ];

  const handleDeleteCategory = async (categoryName, type) => {
    try {
      await axios.delete(`${apiUrl}/api/transactions/categories/custom`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { name: categoryName, type },
      });

      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("❌ Error deleting category:", error.response?.data || error.message);
      toast.error("Failed to delete category.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/transactions/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { credit = [], debit = [] } = res.data;

      setIncomeCategories(credit);
      setExpenseCategories(debit);

      setCustomCategories({
        credit: credit.filter(cat => !defaultCategories.includes(cat)),
        debit: debit.filter(cat => !defaultCategories.includes(cat)),
      });
    } catch (err) {
      console.error("❌ Failed to fetch categories", err);
      toast.error("Could not load categories");
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    try {
      await axios.post(`${apiUrl}/api/transactions/categories`, {
        name: trimmed,
        type: formData.type,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchCategories();
      setFormData(prev => ({ ...prev, category: trimmed }));
      setNewCategory("");
      toast.success("Category added successfully!");
    } catch (err) {
      console.error("Error adding category:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to add category");
    }
  };

  useEffect(() => {
    if (showForm) fetchCategories();
  }, [showForm]);

  const getCategoryOptions = () =>
    formData.type === "credit" ? incomeCategories : expenseCategories;

  const getDropdownColor = () =>
    formData.type === "credit" ? "ring-green-500" :
    formData.type === "debit" ? "ring-red-500" : "";

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md animate-fade-in overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
          {formData._id ? "Edit Transaction" : "Add New Transaction"}
        </h2>

        {isSubmitting ? (
          <div className="text-center py-6">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Saving...</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (formData.amount <= 0) {
                toast.error("Amount must be greater than 0.");
                return;
              }
              handleSubmit(e);
            }}
            className="space-y-4 sm:space-y-5"
          >
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                max={new Date().toISOString().split("T")[0]}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, category: "" })}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Type</option>
                <option value="credit">Income</option>
                <option value="debit">Expense</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`w-full text-left border border-gray-300 px-3 py-2 rounded-md focus:ring-2 ${getDropdownColor()} text-sm`}
                >
                  {formData.category || "Select Category"}
                </button>

                {showCategoryDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                    {getCategoryOptions().map((cat) => (
                      <div
                        key={cat._id || cat}
                        className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 text-sm"
                      >
                        <span
                          className="cursor-pointer flex-1"
                          onClick={() => {
                            setFormData({ ...formData, category: cat });
                            setShowCategoryDropdown(false);
                          }}
                        >
                          {cat}
                        </span>
                        {!defaultCategories.includes(cat) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat, formData.type)}
                            className="text-red-500 text-xs hover:underline ml-2"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add custom category */}
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod || ""}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                {formData.type === "debit" && <option value="Card">Card</option>}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g. Uber ride, Salary, Grocery"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                min={1}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 text-sm"
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
