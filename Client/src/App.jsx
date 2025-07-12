import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/Sidebar";
import MobileMenu from "./Components/MobileMenu";
import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";
import Insights from "./Pages/Insights";

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
              <Route path="/insights" element={<Insights />} />
              <Route path="*" element={<Dashboard />} /> {/* Fallback route */}
            </Routes>
          </main>
        </div>
      </div>

      {/* ✅ Toasts work globally across the app */}
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
