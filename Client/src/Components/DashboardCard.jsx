import { useEffect, useState } from "react";
import axios from "axios";

const DashboardCard = () => {
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlySpend: 0,
    monthlyIncome: 0,
    savingsRate: 0,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transactions"); // Replace with your actual backend URL
        const transactions = res.data;

        let totalBalance = 0;
        let monthlySpend = 0;
        let monthlyIncome = 0;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        transactions.forEach(txn => {
          const txnDate = new Date(txn.date);
          const isThisMonth = txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;

          // Update balance
          totalBalance += txn.type === "credit" ? txn.amount : -txn.amount;

          // Monthly stats
          if (isThisMonth) {
            if (txn.type === "credit") monthlyIncome += txn.amount;
            else if (txn.type === "debit") monthlySpend += txn.amount;
          }
        });

        const savingsRate = monthlyIncome
          ? Math.max(0, (((monthlyIncome - monthlySpend) / monthlyIncome) * 100).toFixed(2))
          : 0;

        setStats({ totalBalance, monthlySpend, monthlyIncome, savingsRate });
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  const financeCards = [
    {
      title: "Total Balance",
      value: `₹${stats.totalBalance.toLocaleString()}`,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Monthly Spend",
      value: `₹${stats.monthlySpend.toLocaleString()}`,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "Income (This Month)",
      value: `₹${stats.monthlyIncome.toLocaleString()}`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Savings Rate",
      value: `${stats.savingsRate}%`,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

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
