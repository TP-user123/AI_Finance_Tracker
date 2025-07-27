import React, { useState } from "react";

const RecurringItemList = ({ items, onDelete, onEdit }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedItem, setEditedItem] = useState({
    source: "",
    amount: "",
    type: "expense",
    date: "",
    frequency: "none",
    autoAdd: false,
  });

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedItem(items[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    // Handle checkbox for autoAdd
    const newValue = name === "autoAdd" ? e.target.checked : value;
    setEditedItem((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(newValue) : newValue,
    }));
  };

  const handleSaveEdit = (index) => {
    onEdit(index, editedItem);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Recurring Items</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No recurring items added yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="border p-4 rounded-md shadow-sm bg-white space-y-2"
            >
              {editingIndex === index ? (
                <>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Source</label>
                      <input
                        type="text"
                        name="source"
                        value={editedItem.source}
                        onChange={handleEditChange}
                        className="w-full mt-1 border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={editedItem.amount}
                        onChange={handleEditChange}
                        className="w-full mt-1 border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <select
                        name="type"
                        value={editedItem.type}
                        onChange={handleEditChange}
                        className="w-full mt-1 border p-2 rounded"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editedItem.date}
                        onChange={handleEditChange}
                        className="w-full mt-1 border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Frequency</label>
                      <select
                        name="frequency"
                        value={editedItem.frequency}
                        onChange={handleEditChange}
                        className="w-full mt-1 border p-2 rounded"
                      >
                        <option value="none">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div className="flex items-center mt-2">
                      <label className="text-sm flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="autoAdd"
                          checked={editedItem.autoAdd}
                          onChange={handleEditChange}
                        />
                        Auto Add to Transactions
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-y-1">
                    <p>
                      <strong>Source:</strong> {item.source}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{item.amount}
                    </p>
                    <p>
                      <strong>Type:</strong>{" "}
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Frequency:</strong> {item.frequency}
                    </p>
                    <p>
                      <strong>Auto Add:</strong>{" "}
                      {item.autoAdd ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEditClick(index)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecurringItemList;
