const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5480;

app.get('/', (req, res) =>  {
    res.send("Server established");
});

app.listen(PORT, () => {
    console.log("Server is runnning on the port", PORT);
});    
