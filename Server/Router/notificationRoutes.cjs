// routes/notificationRoutes.js
import express from "express";
import { sendEmailReminder } from "../utils/sendEmailReminder.js";
import User from "../Model/User.js";

const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware.js");

router.post("/send-reminder", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.spendingLimit) {
      return res.status(404).json({ message: "User data not found" });
    }

    const today = new Date().toDateString();

    const dueItems = user.spendingLimit.expectedRecurringList.filter((item) => {
      const dueDate = new Date(item.nextDueDate || item.date).toDateString();
      return dueDate === today;
    });

    if (dueItems.length === 0) {
      return res.status(200).json({ message: "No reminders for today" });
    }

    for (const item of dueItems) {
      await sendEmailReminder(
        user.email,
        `Reminder: ${item.source} is due today`,
        `Hi ${user.name},\n\nYour recurring item "${item.source}" of ₹${item.amount} is due today.\n\nTrack it in your AI Finance Tracker dashboard.\n\n- WebaSpace Team`
      );
    }

    res.status(200).json({ message: "Reminders sent", count: dueItems.length });
  } catch (error) {
    console.error("❌ Error sending reminders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
