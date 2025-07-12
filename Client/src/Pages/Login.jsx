import React, { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] animate-background">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        <form className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-all rounded-lg font-semibold shadow-md hover:shadow-blue-500/40"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="ml-2 text-blue-400 hover:underline font-medium"
            onClick={toggleForm}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

        {/* Social logins */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300 mb-2">Or continue with</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white/20 hover:bg-white/30 transition-all p-3 rounded-full text-white shadow hover:shadow-blue-500/30">
              <FaGoogle size={20} />
            </button>
            <button className="bg-white/20 hover:bg-white/30 transition-all p-3 rounded-full text-white shadow hover:shadow-blue-500/30">
              <FaFacebookF size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
