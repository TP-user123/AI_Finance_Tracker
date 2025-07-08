import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/insights", label: "Insights" },
  { to: "/settings", label: "Settings" },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:block w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">AI Finance</h2>
      <nav className="space-y-4 text-lg">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block transition-colors ${
                isActive ? "text-blue-400 font-semibold" : "hover:text-blue-400"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
