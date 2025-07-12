// Components/CategoryDetailModal.jsx
import React from "react";
import { X } from "lucide-react"; // Optional: Use an icon for close (install Lucide or use Heroicons)

const CategoryDetailModal = ({ categoryName, transactions, onClose }) => {
  if (!categoryName) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {categoryName} Transactions
          </h2>
          <button
            className="text-gray-500 hover:text-red-600 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Transaction List */}
        <div className="max-h-80 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {transactions.length > 0 ? (
            transactions.map((txn, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg px-4 py-3 shadow-sm border hover:shadow-md transition"
              >
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>{new Date(txn.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}</span>
                  <span className="font-medium text-blue-600">
                    ₹{txn.amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  {txn.description || <span className="italic text-gray-400">No description</span>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-6">
              No transactions found for this category.
            </p>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailModal;
