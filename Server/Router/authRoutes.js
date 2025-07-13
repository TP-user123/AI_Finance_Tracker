const express = require("express");
const { registerUser, loginUser, googleLogin } = require("../Controller/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

module.exports = router;
