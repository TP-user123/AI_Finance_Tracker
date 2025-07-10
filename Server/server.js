const express = require('express');
const app = express();
const ConnectionDB = require('./Config/ConnectionDB');


//Database connection
ConnectionDB;



//listening to the server
app.listen(process.env.PORT || 5001, () => {
    console.log(`Server is running on port ${process.env.PORT || 5001}`);
}); 