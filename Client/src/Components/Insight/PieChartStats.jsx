import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#7ED6DF", "#E77F67", "#F8EFBA", "#3B3B98", "#FD7272",
  "#778beb", "#e15f41", "#55E6C1", "#CAD3C8", "#F97F51"
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name
}) => {
  if (percent < 0.05) return null; // Hide labels < 5%

  const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
    >
      {`${name} (${(percent * 100).toFixed(1)}%)`}
    </text>
  );
};

const PieChartStats = ({ transactions, selectedMonth, selectedYear }) => {
  const categoryTotals = {};

  transactions.forEach((txn) => {
    const date = new Date(txn.date);
    if (
      date.getMonth() + 1 === selectedMonth &&
      date.getFullYear() === selectedYear &&
      txn.type === "debit"
    ) {
      const category = txn.category?.trim() || "Other";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + parseFloat(txn.amount);
    }
  });

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="h-80">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Spending Breakdown</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`₹${value.toFixed(2)}`, name]}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartStats;