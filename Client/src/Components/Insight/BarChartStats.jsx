import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

const BarChartStats = ({ transactions, selectedMonth, selectedYear }) => {
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const totalWeeks = Math.ceil(daysInMonth / 7);
  const weeklyData = Array(totalWeeks).fill(0).map((_, i) => ({
    week: `Week ${i + 1}`,
    total: 0,
  }));

  transactions.forEach((txn) => {
    const date = new Date(txn.date);
    if (
      date.getMonth() + 1 === selectedMonth &&
      date.getFullYear() === selectedYear &&
      txn.type === "debit"
    ) {
      const weekIndex = Math.floor((date.getDate() - 1) / 7); // 0-based weeks
      weeklyData[weekIndex].total += parseFloat(txn.amount);
    }
  });

  return (
    <div className="h-72">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Weekly Spending</h3>
      <ResponsiveContainer>
        <BarChart data={weeklyData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" stroke="#555" />
          <YAxis stroke="#555" tickFormatter={(value) => `₹${value.toFixed(0)}`} />
          <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, "Spent"]} />
          <Bar dataKey="total" fill="url(#gradientSpending)" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="total" position="top" formatter={(value) => `₹${value.toFixed(0)}`} />
          </Bar>
          <defs>
            <linearGradient id="gradientSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00c6ff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#0072ff" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartStats;