// Router/goalRoutes.js
const express = require("express");
const { createGoal, getUserGoals, updateGoal, deleteGoal, markGoalComplete } = require("../Controller/goalController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createGoal);
router.get("/", getUserGoals);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.patch("/:id/complete", markGoalComplete);

module.exports = router;
