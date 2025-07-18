const express = require("express");
const router = express.Router();
const Recurring = require("../Model/User");
const jwt = require("jsonwebtoken");

// Middleware to get user ID from token
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/notifications", authenticate, async (req, res) => {
  try {
    const { _id } = req.user;

    // Fetch recurring items for the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const recurringItems = await Recurring.find({
      userId: _id,
      createdAt: { $gte: startOfMonth }
    });

    res.json({ notifications: recurringItems });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
