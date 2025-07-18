import React, { useEffect, useState } from "react";
import axios from "axios";

const SpendingLimitCard = () => {
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [limitRes, expenseRes] = await Promise.all([
          axios.get("http://localhost:5000/api/user/limits", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/transactions/monthly-total", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const limit = limitRes.data?.monthly || 0;
        const spent = expenseRes.data?.debit || 0;

        setMonthlyLimit(limit);
        setMonthlySpent(spent);

        const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

        // Trigger smooth animation after short delay
        setTimeout(() => {
          setAnimatedWidth(percentage);
        }, 100);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const percentageUsed =
    monthlyLimit > 0 ? Math.min((monthlySpent / monthlyLimit) * 100, 100) : 0;

  const status =
    monthlyLimit === 0
      ? "Limit Not Set"
      : percentageUsed < 70
      ? "Within Limit ✅"
      : percentageUsed < 100
      ? "Warning ⚠️"
      : "Over Budget ❌";

  const statusColor =
    monthlyLimit === 0
      ? "text-gray-500"
      : percentageUsed < 70
      ? "text-green-600"
      : percentageUsed < 100
      ? "text-yellow-600"
      : "text-red-600";

  const progressColor =
    percentageUsed < 70
      ? "bg-green-500"
      : percentageUsed < 100
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full space-y-4 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            💸 Monthly Spending
          </h2>
          <p className="text-gray-500 text-sm">Track your monthly expense limit</p>
        </div>
        <span
          className={`px-3 py-1 text-xs sm:text-sm rounded-full font-semibold shadow-sm ${statusColor} bg-opacity-10 border ${statusColor.replace("text", "border")}`}
        >
          {status}
        </span>
      </div>

      {/* Summary */}
      <div className="text-gray-700 text-base sm:text-lg font-medium">
        Spent: <span className="text-blue-600 font-semibold">₹{monthlySpent}</span>{" "}
        / <span className="text-gray-600">₹{monthlyLimit || "—"}</span>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${progressColor} h-full transition-all duration-700`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>

      {/* Optional Message */}
      {percentageUsed >= 100 && (
        <div className="text-sm text-red-500 mt-1 font-semibold">
          You’ve exceeded your monthly limit!
        </div>
      )}
    </div>
  );
};

export default SpendingLimitCard;
