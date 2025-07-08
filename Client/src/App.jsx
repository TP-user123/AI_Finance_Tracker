import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import MobileMenu from "./Components/MobileMenu";
import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";

function App() {
  return (
    <Router>
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        {/* Sidebar for desktop */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Navbar */}
          <MobileMenu />

          <main className="p-4 sm:p-6">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="*" element={<Dashboard />} /> {/* Fallback route */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
