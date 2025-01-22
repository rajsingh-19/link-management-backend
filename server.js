const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");

const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5480;

app.get('/', (req, res) =>  {
    res.send("Server established");
});

//          wait for the db connection before starting the server
mongoose.connection.once('open', () => {
    console.log("Database Connected");
    //      starting the server after the db connection is established
    app.listen(PORT, () => {
        console.log("Server is runnning on the port", PORT);
    });    
});

//          error handling for db connection issues
mongoose.connection.on('error', (error) => {
    console.log(`Database Connection Error : ${error}`);
});
