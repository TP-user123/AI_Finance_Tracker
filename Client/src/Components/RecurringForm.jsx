import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RecurringForm = ({ onUpdate }) => {
  const [recurringItems, setRecurringItems] = useState([]);
  const [newItem, setNewItem] = useState({
    source: "",
    amount: "",
    type: "income",
    date: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedItem, setEditedItem] = useState(null);

  useEffect(() => {
    const fetchRecurringList = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/user/limits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data?.expectedRecurringList || [];
        setRecurringItems(list);
      } catch (err) {
        toast.error("Failed to fetch recurring items");
      }
    };

    fetchRecurringList();
  }, []);

  const today = new Date();
  const upcomingLimit = new Date();
  upcomingLimit.setDate(today.getDate() + 7);

  const upcomingBills = recurringItems.filter((item) => {
    const due = new Date(item.date);
    return due >= today && due <= upcomingLimit;
  });

  useEffect(() => {
    if (upcomingBills.length > 0) {
      toast.warn(`📢 You have ${upcomingBills.length} upcoming bill(s) due soon!`);
    }
  }, [recurringItems]);

  const handleAddAndSave = async () => {
    if (!newItem.source || !newItem.amount || !newItem.date) {
      toast.error("Please fill in all fields");
      return;
    }

    const updatedList = [...recurringItems, newItem];
    setRecurringItems(updatedList);
    setNewItem({ source: "", amount: "", type: "income", date: "" });

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:5000/api/user/limits",
        { expectedRecurringList: updatedList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Recurring item added & saved");
      if (onUpdate) onUpdate(updatedList);
    } catch (err) {
      toast.error("Failed to save recurring list");
    }
  };

  const handleDelete = async (index) => {
    const updated = [...recurringItems];
    updated.splice(index, 1);
    setRecurringItems(updated);

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:5000/api/user/limits",
        { expectedRecurringList: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Recurring item deleted");
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      toast.error("Failed to update recurring list");
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedItem({ ...recurringItems[index] });
  };

  const handleEditChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    const updatedList = [...recurringItems];
    updatedList[editingIndex] = editedItem;
    setRecurringItems(updatedList);
    setEditingIndex(null);
    setEditedItem(null);

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:5000/api/user/limits",
        { expectedRecurringList: updatedList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Recurring item updated");
      if (onUpdate) onUpdate(updatedList);
    } catch (err) {
      toast.error("Failed to update recurring list");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📌 Recurring Income & Expenses</h2>

      {/* 🔔 Upcoming Bills Notification */}
      {upcomingBills.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-6">
          <strong>Upcoming Bills (Next 7 Days):</strong>
          <ul className="list-disc ml-5 mt-2 text-sm">
            {upcomingBills.map((bill, index) => (
              <li key={index}>
                {bill.source} – ₹{bill.amount} due on{" "}
                {new Date(bill.date).toLocaleDateString("en-IN")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📥 Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Source"
          value={newItem.source}
          onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
          className="border px-4 py-2 rounded-lg w-full"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newItem.amount}
          onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
          className="border px-4 py-2 rounded-lg w-full"
        />
        <select
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          className="border px-4 py-2 rounded-lg w-full"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="date"
          value={newItem.date}
          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
          className="border px-4 py-2 rounded-lg w-full"
        />
      </div>

      <button
        onClick={handleAddAndSave}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mb-8"
      >
        ➕ Add & Save
      </button>

      {/* 📋 Recurring Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recurringItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow flex flex-col justify-between"
          >
            {editingIndex === index ? (
              <>
                <input
                  name="source"
                  value={editedItem.source}
                  onChange={handleEditChange}
                  className="border p-2 rounded mb-2"
                />
                <input
                  name="amount"
                  type="number"
                  value={editedItem.amount}
                  onChange={handleEditChange}
                  className="border p-2 rounded mb-2"
                />
                <select
                  name="type"
                  value={editedItem.type}
                  onChange={handleEditChange}
                  className="border p-2 rounded mb-2"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input
                  name="date"
                  type="date"
                  value={editedItem.date?.split("T")[0]}
                  onChange={handleEditChange}
                  className="border p-2 rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{item.source}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    ₹{item.amount} | <span className="capitalize">{item.type}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Due:{" "}
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700 font-semibold text-sm"
                  >
                    ✖ Remove
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringForm;
