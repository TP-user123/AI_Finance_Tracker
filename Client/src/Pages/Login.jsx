import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import emailjs from "emailjs-com";
const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";




// Send OTP email via EmailJS
const sendOtpEmail = async (email, otp) => {
  try {
    const res = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      { to_email: email, otp },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log("Email sent:", res);
    return res;
  } catch (error) {
    console.error("EmailJS error:", error);
    throw error;
  }
};

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // NEW

  // EmailJS function
  const sendOtpEmail = async (email, otp) => {
    return emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      { to_email: email, otp },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/api/auth/send-otp`, { email });

      if (data.success) {
        await sendOtpEmail(email, data.otp);
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error("Error sending OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/api/auth/verify-otp`, { email, otp });

      if (data.success) {
        toast.success("OTP verified. Please set your new password.");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Change Password
  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/api/auth/change-password`, {
        email,
        newPassword
      });

      if (data.success) {
        toast.success("Password changed successfully");
        onClose();
      } else {
        toast.error(data.message || "Error changing password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-600">Forgot Password</h2>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <>
            <p className="mb-2 text-gray-600">
              OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};



const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
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

    if (res.ok && data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Logged in with Google!");
      navigate("/", { replace: true }); // ✅ use replace to avoid stuck navigation
    } else {
      toast.error(data.message || "Google login failed.");
    }
  } catch (err) {
    console.error("Google login error:", err);
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

          {isLogin && (
            <div className="text-right text-sm">
              <p
                onClick={() => setShowForgotModal(true)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
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
          {isLogin
            ? "Don't have an account? Register here"
            : "Already have an account? Login"}
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  );
};

export default Login;
