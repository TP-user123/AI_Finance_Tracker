import React from "react";

const RecurringItemForm = ({ newItem, handleInputChange, handleAddAndSave }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium">Source</label>
        <input
          type="text"
          name="source"
          value={newItem.source}
          onChange={handleInputChange}
          className="mt-1 w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={newItem.amount}
          onChange={handleInputChange}
          className="mt-1 w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          name="type"
          value={newItem.type}
          onChange={handleInputChange}
          className="mt-1 w-full border p-2 rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={newItem.date}
          onChange={handleInputChange}
          className="mt-1 w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Frequency</label>
        <select
          name="frequency"
          value={newItem.frequency}
          onChange={handleInputChange}
          className="mt-1 w-full border p-2 rounded"
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          onClick={handleAddAndSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Recurring
        </button>
      </div>
    </div>
  );
};

export default RecurringItemForm;
