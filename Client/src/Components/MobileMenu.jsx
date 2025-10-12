import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Home, List, BarChart, Settings, Target } from "lucide-react";

const navLinks = [
  { to: "/", icon: <Home size={26} /> },
  { to: "/transactions", icon: <List size={26} /> },
  { to: "/insights", icon: <BarChart size={26} /> },
  { to: "/goals", icon: <Target size={26} /> },
  { to: "/settings", icon: <Settings size={26} /> },
];

const MobileMenu = () => {
  const navigate = useNavigate();

  

  return (
    <>
      {/* 🌈 Bottom Nav Bar */}
      <div className="fixed bottom-3 inset-x-5 bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl rounded-full flex justify-around items-center h-16 md:hidden z-50 px-3">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-out ${
                isActive
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.5)] -translate-y-2 scale-110"
                  : "bg-transparent text-gray-500 hover:text-blue-400"
              }`
            }
          >
            {item.icon}
            {/* Glow ring when active */}
            {({ isActive }) =>
              isActive && (
                <span className="absolute inset-0 rounded-full border-2 border-blue-300/40 animate-pulse" />
              )
            }
          </NavLink>
        ))}

       
      </div>

    
    </>
  );
};

export default MobileMenu;
