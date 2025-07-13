import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  Title,
  Tooltip,
  Legend
);

const ChartSection = () => {
  const [lineData, setLineData] = useState(null);
  const [pieData, setPieData] = useState(null);
  // Fetch data from API
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔐 Get token from localStorage

      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`, // 🔒 Send token
        },
      });

      const transactions = res.data;
      const currentYear = new Date().getFullYear();

      // ---------- Line Chart (Monthly Spend) ----------
      const monthlyTotals = Array(12).fill(0);
      transactions.forEach(txn => {
        const date = new Date(txn.date);
        if (txn.type === "debit" && date.getFullYear() === currentYear) {
          const month = date.getMonth();
          monthlyTotals[month] += txn.amount;
        }
      });

      const lineChartData = {
        labels: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
          {
            label: "Monthly Spending (₹)",
            data: monthlyTotals,
            borderColor: "#2563eb",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };

      setLineData(lineChartData);

      // ---------- Pie Chart (Category Breakdown) ----------
      const categoryTotals = {};
      transactions.forEach(txn => {
        if (txn.type === "debit") {
          const cat = txn.category || "Other";
          categoryTotals[cat] = (categoryTotals[cat] || 0) + txn.amount;
        }
      });

      const pieChartData = {
        labels: Object.keys(categoryTotals),
        datasets: [
          {
            label: "Spending Breakdown",
            data: Object.values(categoryTotals),
            backgroundColor: [
              "#ef4444", "#3b82f6", "#facc15", "#10b981",
              "#6366f1", "#f97316", "#e11d48", "#22d3ee"
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      };

      setPieData(pieChartData);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  fetchData();
}, []);


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
        text: "Monthly Spending Trend",
        color: "#111827",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        mode: "index",
        intersect: false,
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
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
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
    </section>
  );
};

export default ChartSection;
