import React, { useEffect, useState } from "react";
import axios from "axios";
import RecurringItemForm from "./RecurringItemForm";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const RecurringForm = () => {
  const [recurringItems, setRecurringItems] = useState([]);
  const [newItem, setNewItem] = useState({
    source: "",
    amount: "",
    type: "income",
    date: "",
    frequency: "none",
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // id of item being updated

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchRecurringItems();
  }, []);

  const fetchRecurringItems = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/user/limits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data?.expectedRecurringList || [];
      setRecurringItems(list);
    } catch (err) {
      toast.error("Failed to fetch recurring items");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddAndSave = async () => {
    const token = localStorage.getItem("token");

    if (!newItem.source || !newItem.amount || !newItem.date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/api/user/limits`,
        {
          expectedRecurringList: [newItem],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Item added successfully!");
      setNewItem({
        source: "",
        amount: "",
        type: "income",
        date: "",
        frequency: "none",
      });
      fetchRecurringItems();
    } catch (err) {
      console.error(err);
      toast.error("Error saving item");
    }
  };

  const handleMarkDone = async (itemId) => {
    const token = localStorage.getItem("token");
    setActionLoading(itemId);
    try {
      await axios.post(
        `${apiUrl}/api/recurring/markdone`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Item marked as done");
      fetchRecurringItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark item as done");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUndoDone = async (itemId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.put(
      `${apiUrl}/api/user/recurring/undodone`,
      { id: itemId }, // ✅ send `id`, not `itemId`
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Marked as pending again");
    fetchRecurringItems();
  } catch (err) {
    console.error(err);
    toast.error("Failed to undo item");
  }
};

const handleDelete = async (itemId) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/user/delete/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item deleted");
      fetchRecurringItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Recurring Item</h2>
      <RecurringItemForm
        newItem={newItem}
        handleInputChange={handleInputChange}
        handleAddAndSave={handleAddAndSave}
      />

      <h3 className="text-xl font-semibold mt-8 mb-4">Your Recurring Items</h3>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : recurringItems.length === 0 ? (
        <p className="text-gray-600">No recurring items found.</p>
      ) : (
        <div className="space-y-4">
          {recurringItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-3"
            >
              <div className="space-y-1">
                <p className="font-semibold text-lg">{item.source}</p>
                <p>
                  ₹{item.amount} • {item.type} • {item.frequency}
                </p>
                <p className="text-sm text-gray-500">
                  Start Date:{" "}
                  <span className="font-medium text-black">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </p>
                {item.nextDueDate && (
                  <p className="text-sm text-gray-500">
                    Next Due:{" "}
                    <span className="font-medium text-black">
                      {new Date(item.nextDueDate).toLocaleDateString()}
                    </span>
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`capitalize font-medium ${
                      item.status === "done"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {item.status || "pending"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
               {item.status === "done" ? (
  <button
    className="mt-4 md:mt-0 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
    onClick={() => handleUndoDone(item._id)}
  >
    🔄 Undo
  </button>
) : (
  <button
    className="mt-4 md:mt-0 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
    onClick={() => handleMarkDone(item._id)}
  >
    ✅ Mark as Done
  </button>
  
)}
 <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "🗑️ Delete"}
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecurringForm;
