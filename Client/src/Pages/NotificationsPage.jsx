import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Bell, AlertTriangle } from "lucide-react";
import dayjs from "dayjs";
import { getUserFromToken } from "../utils/auth"; // Make sure this exists and works

const NotificationsPage = () => {
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [recurringItems, setRecurringItems] = useState([]);
  const [expectedRecurring, setExpectedRecurring] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (user?._id) {
      setUserId(user._id);
      fetchData(user._id);
    }
  }, []);

  const fetchData = async (id) => {
    try {
      const statsRes = await axios.get(`/api/stats/${id}`);
      const recurringRes = await axios.get(`/api/recurring/${id}`);
      const limitsRes = await axios.get(`/api/user/limits`);

      setMonthlyStats(statsRes.data);
      setRecurringItems(recurringRes.data || []);
      setExpectedRecurring(limitsRes.data?.expectedRecurringList || []);
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  const getRecurringMatchMessage = () => {
    if (!expectedRecurring.length || !recurringItems.length) return null;

    const missing = expectedRecurring.filter((expected) => {
      return !recurringItems.some((item) =>
        item.source.toLowerCase() === expected.source.toLowerCase() &&
        parseFloat(item.amount) === parseFloat(expected.amount)
      );
    });

    if (missing.length === 0) {
      return (
        <NotificationCard
          type="success"
          message="✅ All recurring items are recorded this month!"
        />
      );
    } else {
      return missing.map((item, i) => (
        <NotificationCard
          key={i}
          type="warning"
          message={`⚠️ Missing expected recurring item: ${item.source} - ₹${item.amount}`}
        />
      ));
    }
  };

  const getOverspentCategories = () => {
    if (!monthlyStats?.currentMonth || !monthlyStats?.limits?.categories) return [];

    const { currentMonth } = monthlyStats;
    const { categories } = monthlyStats.limits;

    return Object.entries(currentMonth)
      .filter(([cat, amount]) => {
        if (["credit", "debit"].includes(cat)) return false;
        return amount > (categories[cat] || Infinity);
      })
      .map(([cat, amount], i) => (
        <NotificationCard
          key={i}
          type="danger"
          message={`❌ Overspent in ${cat}: ₹${amount} (Limit: ₹${monthlyStats.limits.categories[cat]})`}
        />
      ));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Bell className="w-6 h-6 text-blue-500" />
        Notifications
      </h2>

      {/* Recurring items check */}
      {getRecurringMatchMessage()}

      {/* Overspending alerts */}
      {getOverspentCategories().length > 0 ? (
        getOverspentCategories()
      ) : (
        <NotificationCard
          type="info"
          message="✅ You're within all category limits this month!"
        />
      )}
    </div>
  );
};

const NotificationCard = ({ type = "info", message }) => {
  const iconMap = {
    success: <CheckCircle className="text-green-500" />,
    warning: <AlertTriangle className="text-yellow-500" />,
    danger: <XCircle className="text-red-500" />,
    info: <Bell className="text-blue-500" />,
  };

  const bgMap = {
    success: "bg-green-100",
    warning: "bg-yellow-100",
    danger: "bg-red-100",
    info: "bg-blue-100",
  };

  return (
    <div className={`rounded-lg p-4 flex items-start gap-3 ${bgMap[type]}`}>
      {iconMap[type]}
      <p className="text-sm text-gray-800">{message}</p>
    </div>
  );
};

export default NotificationsPage;
