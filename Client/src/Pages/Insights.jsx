import { useEffect, useState } from "react";
import axios from "axios";
import InsightCard from "../Components/InsightCard";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";




const Insights = () => {
 const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState({
    currentMonth: {},
    previousMonth: {},
  });

  // ✅ Function to generate current & previous month stats
  const generateStats = (allTxns, selectedMonth, selectedYear) => {
    const stats = { currentMonth: {}, previousMonth: {} };

    allTxns.forEach((txn) => {
      const txnDate = new Date(txn.date);
      const txnMonth = txnDate.getMonth() + 1;
      const txnYear = txnDate.getFullYear();

      // ➤ Current month
      if (txnMonth === selectedMonth && txnYear === selectedYear) {
        const { type, category, amount } = txn;
        stats.currentMonth[category] =
          (stats.currentMonth[category] || 0) + parseFloat(amount);
        stats.currentMonth[type] =
          (stats.currentMonth[type] || 0) + parseFloat(amount);
      }

      // ➤ Previous month
      const prev = new Date(selectedYear, selectedMonth - 2); // Month is 0-based
      if (
        txnMonth === prev.getMonth() + 1 &&
        txnYear === prev.getFullYear()
      ) {
        const { type, category, amount } = txn;
        stats.previousMonth[category] =
          (stats.previousMonth[category] || 0) + parseFloat(amount);
        stats.previousMonth[type] =
          (stats.previousMonth[type] || 0) + parseFloat(amount);
      }
    });

    setMonthlyStats(stats);
  };

  // ✅ Fetch transactions + trigger generateStats when month/year changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transactions");
        setTransactions(res.data);
        generateStats(res.data, selectedMonth, selectedYear); // ⬅️ Use proper args
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]); // Re-run when month/year changes
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Insights</h1>
      <div className="flex flex-wrap gap-4 items-center mb-6">
  <select
    className="border px-4 py-2 rounded-md"
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
  >
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {new Date(0, i).toLocaleString("default", { month: "long" })}
      </option>
    ))}
  </select>

  <select
    className="border px-4 py-2 rounded-md"
    value={selectedYear}
    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
  >
    {Array.from({ length: 5 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    })}
  </select>
</div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightCard
          title="Total Income (This Month)"
          amount={monthlyStats.currentMonth.credit || 0}
          type="credit"
        />
        <InsightCard
          title="Total Expense (This Month)"
          amount={monthlyStats.currentMonth.debit || 0}
          type="debit"
        />
        <InsightCard
          title="Net Savings"
          amount={
            (monthlyStats.currentMonth.credit || 0) -
            (monthlyStats.currentMonth.debit || 0)
          }
          type="neutral"
        />
      </div>
      {/* Month-on-Month Comparison */}
<div className="mt-10">
  <h2 className="text-xl font-bold text-gray-700 mb-4">Monthly Comparison</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {["credit", "debit"].map((type) => {
      const current = monthlyStats.currentMonth[type] || 0;
      const previous = monthlyStats.previousMonth[type] || 0;
      const diff = current - previous;
      const diffText =
        diff === 0
          ? "No change"
          : diff > 0
          ? `↑ ₹${Math.abs(diff).toLocaleString()} more than last month`
          : `↓ ₹${Math.abs(diff).toLocaleString()} less than last month`;

      return (
        <div
          key={type}
          className={`rounded-lg p-4 border-l-4 shadow-sm ${
            type === "credit"
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          <h3 className="text-md font-medium text-gray-700 capitalize">
            {type === "credit" ? "Income" : "Expense"}
          </h3>
          <p className="text-xl font-bold mt-1">
            ₹{current.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">{diffText}</p>
        </div>
      );
    })}
  </div>
</div>

{/* Smart Insights */}
<div className="mt-10">
  <h2 className="text-xl font-bold text-gray-700 mb-4">Smart Insights</h2>
  <ul className="space-y-3">
    {Object.entries(monthlyStats.currentMonth)
      .filter(([k]) => !["credit", "debit"].includes(k))
      .map(([category, amount]) => {
        const income = monthlyStats.currentMonth.credit || 0;
        const percent = income ? ((amount / income) * 100).toFixed(1) : 0;
        if (percent >= 50) {
          return (
            <li
              key={category}
              className="bg-yellow-100 text-yellow-800 p-4 rounded-md"
            >
              ⚠️ You spent <b>{percent}%</b> of your income on <b>{category}</b>. Consider reducing this!
            </li>
          );
        } else if (percent > 0 && percent < 10) {
          return (
            <li
              key={category}
              className="bg-green-100 text-green-800 p-4 rounded-md"
            >
              ✅ Great! Only <b>{percent}%</b> of your income went to <b>{category}</b>.
            </li>
          );
        }
        return null;
      })}
  </ul>
</div>


      {/* Later we'll add: comparison, pie chart, bar chart, category insights */}
    </div>
  );
};

export default Insights;
