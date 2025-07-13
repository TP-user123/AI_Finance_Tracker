import { useEffect, useState } from "react";
import axios from "axios";
import InsightCard from "../Components/InsightCard";
import MonthComparison from "../Components/Insight/MonthComparison";
import SmartInsights from "../Components/Insight/SmartInsights";
import PieChartStats from "../Components/Insight/PieChartStats";
import BarChartStats from "../Components/Insight/BarChartStats";
import CategoryInsights from "../Components/Insight/CategoryInsights";

const Insights = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState({
    currentMonth: {},
    previousMonth: {},
  });

  const generateStats = (allTxns, selectedMonth, selectedYear) => {
    const stats = { currentMonth: {}, previousMonth: {} };

    allTxns.forEach((txn) => {
      const txnDate = new Date(txn.date);
      const txnMonth = txnDate.getMonth() + 1;
      const txnYear = txnDate.getFullYear();

      const { type, category, amount } = txn;
      const safeCategory = category?.trim() || "Other";

      if (txnMonth === selectedMonth && txnYear === selectedYear) {
        if (type === "debit") {
          stats.currentMonth[safeCategory] =
            (stats.currentMonth[safeCategory] || 0) + parseFloat(amount);
        }
        stats.currentMonth[type] =
          (stats.currentMonth[type] || 0) + parseFloat(amount);
      }

      const prev = new Date(selectedYear, selectedMonth - 2);
      if (
        txnMonth === prev.getMonth() + 1 &&
        txnYear === prev.getFullYear()
      ) {
        if (type === "debit") {
          stats.previousMonth[safeCategory] =
            (stats.previousMonth[safeCategory] || 0) + parseFloat(amount);
        }
        stats.previousMonth[type] =
          (stats.previousMonth[type] || 0) + parseFloat(amount);
      }
    });

    setMonthlyStats(stats);
  };

  // Fetch transactions and generate stats
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔐 Get the JWT token

      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token here
        },
      });

      setTransactions(res.data);
      generateStats(res.data, selectedMonth, selectedYear); // 📊 Generate stats using filtered data
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  fetchData();
}, [selectedMonth, selectedYear]);


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

      <MonthComparison monthlyStats={monthlyStats} />

      {(monthlyStats.currentMonth.credit > 0 || monthlyStats.currentMonth.debit > 0) ? (
        <SmartInsights monthlyStats={monthlyStats} />
      ) : (
        <div className="mt-10 text-gray-500 italic">
          No income recorded this month. Smart insights unavailable.
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Visual Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PieChartStats transactions={transactions} selectedMonth={selectedMonth} selectedYear={selectedYear} />
          <BarChartStats transactions={transactions} selectedMonth={selectedMonth} selectedYear={selectedYear} />
        </div>
      </div>

      <CategoryInsights transactions={transactions} selectedMonth={selectedMonth} selectedYear={selectedYear} />
    </div>
  );
};

export default Insights;
