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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
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

        {/* Logout Icon */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-xs text-red-500"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileMenu;
