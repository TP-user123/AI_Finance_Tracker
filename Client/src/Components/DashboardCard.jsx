const financeCards = [
  { title: "Total Balance", value: "$25,000", color: "text-green-600", bg: "bg-green-50" },
  { title: "Monthly Spend", value: "$1,850", color: "text-red-500", bg: "bg-red-50" },
  { title: "Income (This Month)", value: "$3,000", color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Savings Rate", value: "38%", color: "text-purple-600", bg: "bg-purple-50" },
];

const DashboardCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {financeCards.map((card, index) => (
        <div
          key={index}
          className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 ${card.bg}`}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;