import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setForm({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(`${apiUrl}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(`${isLogin ? "Logged in" : "Registered"} successfully!`);
        navigate("/");
      } else {
        toast.error(data.message || "Invalid credentials or user not found.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (cred) => {
    setLoading(true);
    try {
      const decoded = jwtDecode(cred.credential);
      const res = await fetch(`${apiUrl}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: cred.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Logged in with Google!");
        navigate("/");
      } else {
        toast.error("Google login failed.");
      }
    } catch (err) {
      toast.error("Google Sign-in Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-pink-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200 animate-fadeIn">
        <img
          src="https://cdn-icons-png.flaticon.com/256/4593/4593628.png"
          alt="Logo"
          className="w-24 h-24 mx-auto mb-4"
        />
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">or</div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Sign-in Failed")}
            width="100%"
          />
        </div>

        <p
          onClick={toggleMode}
          className="mt-6 text-center text-blue-600 hover:underline cursor-pointer"
        >
          {isLogin ? "Don't have an account? Register here" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
