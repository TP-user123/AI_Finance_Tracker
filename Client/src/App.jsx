import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

import Sidebar from "./Components/Sidebar";
import MobileMenu from "./Components/MobileMenu";
import Navbar from "./Components/Navbar";
import PrivateRoute from "./Components/PrivateRoute";

import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";
import Insights from "./Pages/Insights";
import Settings from "./Pages/Settings";
import Goals from "./Pages/Goals";
import Login from "./Pages/Login";
import NotFoundPage from "./Pages/NotFoundPage";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // No token — user not logged in

    try {
      const decoded = jwtDecode(token);

      // Check token expiration (if expired, remove it)
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.info("Session expired. Please log in again.");
        navigate("/login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Invalid session. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar and Navbar only if not on login page */}
      {!isLoginPage && <Sidebar />}

      <div className={`flex-1 ${!isLoginPage ? "md:ml-64" : ""}`}>
        {!isLoginPage && <MobileMenu />}
        {!isLoginPage && <Navbar />}

        <main className={`p-4 sm:p-6 ${!isLoginPage ? "pb-20" : ""}`}>
          <Routes>
            {/* ✅ Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <PrivateRoute>
                  <Insights />
                </PrivateRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <Goals />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* 🟢 Public Route */}
            <Route path="/login" element={<Login />} />

            {/* 🔴 Not Found */}
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
