import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import PrivateRoute from "./Components/PrivateRoute";
import Settings from "./Pages/Settings";

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
        {!isLoginPage && <Navbar />}
        <main className={`p-4 sm:p-6  ${!isLoginPage ? "pb-20" : ""}`}>
          <Routes>
            {/* Protected Routes */}
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
                  <Insights/>
                </PrivateRoute>
              }
            />

            

           
            <Route
              path="/Settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            {/* Public Route */}
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
