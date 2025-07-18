const express = require('express');
const app = express();
const ConnectionDB = require('./Config/ConnectionDB');
const transactionRoutes = require('./Router/transactionRoutes');
const insightsRoutes = require('./Router/insights');
const authRoutes = require('./Router/authRoutes');  // 👈 Add this
const cors = require('cors');
const dotenv = require('dotenv');
const limitsRoutes = require("./Router/userRoutes"); // or limits.js
const notificationsRoutes = require("./Router/notifications");



dotenv.config();

// Database connection
ConnectionDB;

// Middleware
app.use(cors({ origin : 'https://finance-tracker-ai.netlify.app/'}));
app.use(express.json());

// Routers
app.use('/api/auth', authRoutes);  // 👈 Add this line
app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightsRoutes);
app.use("/api/user", limitsRoutes);
app.use("/api", notificationsRoutes);


// Server
app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT || 5001}`);
});
