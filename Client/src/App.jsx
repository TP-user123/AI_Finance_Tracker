import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/Sidebar";
import MobileMenu from "./Components/MobileMenu";
import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";
import Insights from "./Pages/Insights";
import NotFoundPage from "./Pages/NotFoundPage";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar only if not on login page */}
      {!isLoginPage && <Sidebar />}

      <div className={`flex-1 ${!isLoginPage ? "md:ml-64" : ""}`}>
        {/* Mobile navbar only if not on login page */}
        {!isLoginPage && <MobileMenu />}
<Navbar />
        <main className="p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
