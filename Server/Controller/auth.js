// controllers/authController.js
const User = require("../Model/User");
const bcrypt = require("bcryptjs");

// 1️⃣ Send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // valid for 5 minutes
    await user.save();

    // We return OTP so the frontend can send via EmailJS
    res.status(200).json({ success: true, otp, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error generating OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// 3️⃣ Change Password
exports.changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
