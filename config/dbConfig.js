const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from the .env file into process.env
dotenv.config();

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;
