import React from "react";
import { X } from "lucide-react";

const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-fade-in">
        {/* Close Icon */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-2">
          Transaction Details
        </h2>

        {/* Details */}
        <div className="space-y-3 text-gray-700 text-sm">
          <Detail label="Date" value={new Date(transaction.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })} />
          <Detail label="Type" value={capitalize(transaction.type)} />
          <Detail label="Category" value={transaction.category} />
          <Detail label="Amount" value={`₹${transaction.amount.toLocaleString()}`} highlight={transaction.type === "credit" ? "green" : "red"} />
          <Detail label="Description" value={transaction.description || "No description provided"} />
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Reusable detail row
const Detail = ({ label, value, highlight }) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}</span>
    <span className={highlight === "green" ? "text-green-600 font-semibold" : highlight === "red" ? "text-red-600 font-semibold" : ""}>
      {value}
    </span>
  </div>
);

// 🔹 Capitalize type
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default TransactionDetailModal;
