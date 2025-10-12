const express = require('express');
const app = express();
const ConnectionDB = require('./Config/ConnectionDB');
const transactionRoutes = require('./Router/transactionRoutes');
const insightsRoutes = require('./Router/insights');
const authRoutes = require('./Router/authRoutes');  // 👈 Add this
const cors = require('cors');
const dotenv = require('dotenv');
const limitsRoutes = require("./Router/userRoutes"); // or limits.js
const chatRoutes = require("./Router/chatRoutes"); // Import chat routes
const insightsPrediction = require('./utils/insightsPrediction'); // Import insights prediction
const authRoutesOTP = require("./Router/auth");
const goalRoutes = require("./Router/goalRoutes"); // Import goal routes


dotenv.config();

// Database connection
ConnectionDB;

// Middleware
app.use(cors());
app.use(express.json());  

// Routers
app.use('/api/auth', authRoutes);  
app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightsRoutes);
app.use("/api/user", limitsRoutes);
app.use('/api/insights', insightsPrediction); // Use insights prediction routes
app.use('/api/chat', chatRoutes); // Use chat routes
app.use('/api/recurring', require('./Router/recurring')); // Use recurring routes
app.use('/api/goals', goalRoutes); // Use goal routes
app.use('/api/auth', authRoutesOTP); // Use OTP authentication routes




// Server
app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT || 5001}`);
});
