const express = require('express');
const app = express();
const ConnectionDB = require('./Config/ConnectionDB');
const transactionRoutes = require('./Router/transactionRoutes');
const cors = require('cors');
const dotenv = require('dotenv');


//Database connection
ConnectionDB;


//Router Middleware
app.use(cors());
app.use(express.json());
app.use('/api/transactions', transactionRoutes);




//listening to the server
app.listen(process.env.PORT || 5001, () => {
    console.log(`Server is running on port ${process.env.PORT || 5001}`);
}); 