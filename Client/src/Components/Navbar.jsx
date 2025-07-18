import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react"; // Add icon
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [hasUpcomingBills, setHasUpcomingBills] = useState(false); // Example flag
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
      }
    }

    // Simulate bill check (replace with actual upcoming bills logic)
    const checkBills = () => {
      // For now, just simulate that we have upcoming bills
      setHasUpcomingBills(true);
    };
    checkBills();
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Title */}
          <div className="text-xl font-semibold text-gray-800">💰 MyFinance</div>

          {/* Right section: Notification + User Info */}
          <div className="flex items-center gap-6">
            {/* 🔔 Notification Bell */}
            <button
              onClick={() => navigate("/notifications")} // Navigate to notifications page
              className="relative"
              title="Upcoming Bills"
            >
              <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
              {hasUpcomingBills && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
              {hasUpcomingBills && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* 👤 User Info */}
            {user ? (
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="User"
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="text-gray-700 font-medium">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Not Logged In</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
