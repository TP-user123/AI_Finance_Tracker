import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Home, List, BarChart, Settings } from "lucide-react";

const navLinks = [
  { to: "/", label: "Dashboard", icon: <Home size={20} /> },
  { to: "/transactions", label: "Transactions", icon: <List size={20} /> },
  { to: "/insights", label: "Insights", icon: <BarChart size={20} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
];

const MobileMenu = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    setShowModal(false);
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow md:hidden z-50">
        <nav className="flex justify-around items-center h-16">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-xs ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-500"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center text-xs text-red-500"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
       <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
