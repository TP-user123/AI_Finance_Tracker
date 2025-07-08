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

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Monthly Spending (₹)",
      data: [1200, 1900, 1600, 2400, 1800, 2000],
      borderColor: "#2563eb",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const pieData = {
  labels: ["Food", "Rent", "Transport", "Shopping"],
  datasets: [
    {
      label: "Spending Breakdown",
      data: [450, 900, 200, 300],
      backgroundColor: ["#ef4444", "#3b82f6", "#facc15", "#10b981"],
      borderColor: "#ffffff",
      borderWidth: 2,
    },
  ],
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        color: "#374151",
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: true,
      text: "Monthly Spending Trend",
      color: "#111827",
      font: {
        size: 16,
        weight: "bold",
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#6b7280",
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        color: "#6b7280",
      },
      grid: {
        color: "#e5e7eb",
      },
    },
  },
};

const ChartSection = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
      {/* Line Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md h-[320px]">
        <Line options={lineOptions} data={lineData} />
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md h-[320px] flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Spending by Category
        </h2>
        <div className="flex-1">
          <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </section>
  );
};

export default ChartSection;