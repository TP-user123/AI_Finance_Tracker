const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, changePassword} = require("../Controller/auth");

// Send OTP
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/change-password", changePassword)



module.exports = router;
