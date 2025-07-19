import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const ExpectedIncomeCard = () => {
  const [recurringList, setRecurringList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${apiUrl}/api/user/limits`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Fetched expectedRecurringList:", res.data?.expectedRecurringList);
        setRecurringList(res.data?.expectedRecurringList || []);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!recurringList.length) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full space-y-4 transition-all">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        📅 Recurring Monthly Entries
      </h2>

      {recurringList.map((entry, idx) => {
        const isIncome = entry.type === "income";
        const icon = isIncome ? "📈" : "📉";
        const amountColor = isIncome ? "text-green-600" : "text-red-500";
        const typeText = isIncome ? "receive" : "pay";

        return (
          <div
            key={idx}
            className="border-l-4 pl-4 py-2 bg-gray-50 rounded-md shadow-sm"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-700">
                {icon} <span className="capitalize">{entry.source}</span>
              </p>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isIncome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
              >
                {entry.type}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              You {typeText}{" "}
              <span className={`font-semibold ${amountColor}`}>
                ₹{entry.amount || 0}
              </span>{" "}
              around{" "}
              {entry.date && (
                <span className="font-medium text-gray-800">
                  {new Date(entry.date).getDate()}th
                </span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ExpectedIncomeCard;
