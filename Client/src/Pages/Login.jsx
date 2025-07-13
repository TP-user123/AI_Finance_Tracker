import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
  const url = isLogin ? "/api/auth/login" : "/api/auth/register";

  const res = await fetch(`http://localhost:5000${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Add this
    toast.success(`${isLogin ? "Logged in" : "Registered"} successfully!`);
    window.location.href = "/"; // redirect
  } else {
    toast.error(data.message || "Something went wrong");
  }
};


 const handleGoogleLogin = async (cred) => {
  const decoded = jwtDecode(cred.credential);

  const res = await fetch("http://localhost:5000/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: cred.credential }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Add this
    toast.success("Logged in with Google!");
    window.location.href = "/";
  } else {
    toast.error("Google login failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-pink-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            {isLogin ? "Login" : "Register"}
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
