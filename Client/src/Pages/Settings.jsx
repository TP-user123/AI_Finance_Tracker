import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { LogOut } from "lucide-react";
import RecurringForm from "../Components/RecurringForm";

const apiUrl = import.meta.env.VITE_API_URL;

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/login");
  };

  if (!user)
    return <div className="text-center mt-10 text-lg">Loading user data...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 sm:p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">⚙️ Settings</h1>

      {/* Profile */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-6 rounded-xl shadow mb-8">
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
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Monthly Limit */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          💰 Monthly Spending Limit
        </h2>
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
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save Limit"}
        </button>
      </div>

      {/* Recurring Income/Expense Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
            🔁 Recurring Income / Expense
          </h2>
          <button
            onClick={() => setShowRecurringModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Recurring Item
          </button>
        </div>
      </div>

      {/* 🚪 Mobile Logout Button */}
      <div className="sm:hidden flex justify-center mt-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 active:scale-95 transition-all"
        >
          <LogOut size={22} />
          Logout
        </button>
      </div>

      {/* Recurring Modal */}
      {showRecurringModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowRecurringModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Add Recurring Income / Expense
            </h3>
            <div className="max-h-[70vh] overflow-y-auto">
              <RecurringForm />
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 animate-bounceIn">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
