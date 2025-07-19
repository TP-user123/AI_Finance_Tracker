import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

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
          axios.get(`${apiUrl}/api/user/limits`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/transactions/monthly-total`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const limit = limitRes.data?.monthly || 0;
        const spent = expenseRes.data?.debit || 0;

        setMonthlyLimit(limit);
        setMonthlySpent(spent);

        const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
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

  if (loading) return <div className="text-center py-6 text-gray-500">Loading...</div>;

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
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-full space-y-4 transition-all duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            💸 Monthly Spending
          </h2>
          <p className="text-gray-500 text-sm">Track your monthly expense limit</p>
        </div>
        <span
          className={`px-3 py-1 text-xs sm:text-sm rounded-full font-semibold shadow-sm whitespace-nowrap ${statusColor} bg-opacity-10 border ${statusColor.replace("text", "border")}`}
        >
          {status}
        </span>
      </div>

      {/* Summary */}
      <div className="text-gray-700 text-base sm:text-lg font-medium">
        Spent:{" "}
        <span className="text-blue-600 font-semibold">
          ₹{monthlySpent.toLocaleString()}
        </span>{" "}
        / <span className="text-gray-600">₹{monthlyLimit?.toLocaleString() || "—"}</span>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${progressColor} h-full transition-all duration-700`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>

      {/* Optional Message */}
      {percentageUsed >= 100 && (
        <div className="text-sm text-red-500 font-semibold">
          You’ve exceeded your monthly limit!
        </div>
      )}
    </div>
  );
};

export default SpendingLimitCard;
