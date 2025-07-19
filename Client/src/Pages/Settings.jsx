import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import RecurringForm from "../Components/RecurringForm";
const apiUrl = import.meta.env.VITE_API_URL;

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        fetchSpendingLimit(token);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      toast.error(`${error.message}. Please login again.`);
      navigate("/login");
    }
  }, [navigate]);

  const fetchSpendingLimit = async (token) => {
    try {
      const res = await axios.get(`${apiUrl}/api/user/limits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlyLimit(res.data?.monthly || 0);
    } catch (err) {
      toast.error("Failed to fetch limits");
    }
  };

  const handleLimitUpdate = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/api/user/limits`,
        { monthly: Number(monthlyLimit) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Monthly limit updated");
    } catch (err) {
      toast.error("Failed to update monthly limit");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user)
    return <div className="text-center mt-10 text-lg">Loading user data...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 sm:p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">⚙️ Settings</h1>

      {/* Profile */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow mb-8">
        {user.picture ? (
          <img
            src={user.picture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold border-4 border-blue-100 shadow">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Monthly Limit */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">💰 Monthly Spending Limit</h2>
        <input
          type="number"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter monthly limit e.g. 50000"
        />
        <p className="text-sm text-gray-500 mt-2">
          Set your maximum allowable monthly spending.
        </p>
        <button
          onClick={handleLimitUpdate}
          disabled={isSaving}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {isSaving ? "Saving..." : "Save Limit"}
        </button>
      </div>

      {/* Recurring Income/Expense Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🔁 Recurring Income / Expense
        </h2>
        <RecurringForm />
      </div>
    </div>
  );
};

export default Settings;
