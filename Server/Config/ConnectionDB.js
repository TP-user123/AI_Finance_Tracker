const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL, {
  
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));


module.exports = mongoose; // Export the mongoose instance for use in other files