import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/insights", label: "Insights" },
  { to: "/settings", label: "Settings" },
];

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* Top Navbar (Mobile Only) */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center md:hidden">
        <h1 className="text-xl font-bold">AI Finance</h1>
        <button onClick={() => setIsOpen(true)} aria-label="Open menu">
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden flex`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0  bg-opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Transparent Drawer Panel */}
        <div className="relative w-64 h-full p-6 z-50 backdrop-blur-md bg-white/10 border-r border-white/20 text-black">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">AI Finance</h2>
            <button onClick={() => setIsOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-4">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-2 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "hover:bg-white/20"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
