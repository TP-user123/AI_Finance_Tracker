const InsightCard = ({ title, amount, type = "neutral" }) => {
  const colors = {
    credit: "text-green-600 bg-green-100",
    debit: "text-red-600 bg-red-100",
    neutral: "text-gray-800 bg-gray-100",
  };

  return (
    <div className={`rounded-xl p-5 shadow-md border-l-4 ${colors[type]}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${colors[type].split(" ")[0]}`}>
        ₹{amount.toLocaleString()}
      </p>
    </div>
  );
};

export default InsightCard;
