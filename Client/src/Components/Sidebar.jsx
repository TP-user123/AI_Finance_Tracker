import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/insights", label: "Insights" },
  { to: "/settings", label: "Settings" },
  { to: "/goals", label: "Goals" },
  
];

const Sidebar = () => {
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
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 text-black"
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
    </aside>
  );
};

export default Sidebar;
