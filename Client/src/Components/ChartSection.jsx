import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";

// Register chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { Bar } from "react-chartjs-2";

const apiUrl = import.meta.env.VITE_API_URL;
const ChartSection = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [lineData, setLineData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [years, setYears] = useState([currentYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${apiUrl}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transactions = res.data;

        // Collect unique years from transactions for the dropdown
        const uniqueYears = Array.from(
          new Set(transactions.map(txn => new Date(txn.date).getFullYear()))
        ).sort((a, b) => b - a);
        setYears(uniqueYears);

        // Filter transactions based on selected year
        const filtered = transactions.filter(
          txn => new Date(txn.date).getFullYear() === selectedYear
        );

        // ----- Line Chart Data (debit & credit both) -----
        const monthlyDebit = Array(12).fill(0);
        const monthlyCredit = Array(12).fill(0);
        filtered.forEach(txn => {
          const date = new Date(txn.date);
          const month = date.getMonth();
          if (txn.type === "debit") {
            monthlyDebit[month] += txn.amount;
          } else if (txn.type === "credit") {
            monthlyCredit[month] += txn.amount;
          }
        });

        setLineData({
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ],
          datasets: [
            {
              label: "Spending (₹)",
              data: monthlyDebit,
              borderColor: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: "Income (₹)",
              data: monthlyCredit,
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });

        // ----- Pie Chart (Category Breakdown) -----
        const categoryTotals = {};
        filtered.forEach(txn => {
          if (txn.type === "debit") {
            const cat = txn.category || "Other";
            categoryTotals[cat] = (categoryTotals[cat] || 0) + txn.amount;
          }
        });

        setPieData({
          labels: Object.keys(categoryTotals),
          datasets: [
            {
              label: "Spending Breakdown",
              data: Object.values(categoryTotals),
              backgroundColor: [
                "#ef4444", "#3b82f6", "#facc15", "#10b981",
                "#6366f1", "#f97316", "#e11d48", "#22d3ee"
              ],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, [selectedYear]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: `Monthly Spending & Income in ${selectedYear}`,
        color: "#111827",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#6b7280" },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Spending by Category",
        color: "#111827",
        font: { size: 16, weight: "bold" },
      },
    },
  };

  return (
    <section className="mt-6">
      {/* Year Dropdown */}
      {/* Enhanced Year Selector */}
<div className="mb-6 flex flex-wrap items-center gap-3">
  <label
    htmlFor="year"
    className="text-gray-700 text-sm font-medium"
  >
    Select Year:
  </label>
  <select
    id="year"
    value={selectedYear}
    onChange={(e) => setSelectedYear(Number(e.target.value))}
    className="px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
  >
    {years.map((y) => (
      <option key={y} value={y}>
        {y}
      </option>
    ))}
  </select>
</div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md h-[320px]">
          {lineData ? (
            <Line options={lineOptions} data={lineData} />
          ) : (
            <p className="text-gray-500 text-sm">Loading line chart...</p>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md h-[320px]">
          {pieData ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <p className="text-gray-500 text-sm">Loading pie chart...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChartSection;
