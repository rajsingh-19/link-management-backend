const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const device = require("express-device")
const connectDB = require("./config/dbConfig");
const userRoute = require("./routes/user.route");
const linkRoute = require('./routes/link.route');

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(device.capture());

const PORT = process.env.PORT || 5480;

app.use('/api/user', userRoute);
app.use('/api/link', linkRoute);

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
