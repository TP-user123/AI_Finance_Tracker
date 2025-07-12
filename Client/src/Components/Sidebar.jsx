import { NavLink, useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/insights", label: "Insights" },
  { to: "/settings", label: "Settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear session/token if any
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-6 justify-between z-40 shadow-lg">
      {/* Top Section */}
      <div>
        <h2 className="text-2xl font-bold mb-8">AI Finance</h2>
        <nav className="space-y-4 text-lg">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block transition-colors ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-400"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Logout */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 px-4 rounded-md text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
