import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
      }
    }
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Title */}
          <div className="text-xl font-semibold text-gray-800">
            💰 MyFinance
          </div>

          {/* User Info */}
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
    </header>
  );
};

export default Navbar;
