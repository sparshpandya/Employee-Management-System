const express = require("express");
const app = express();

// Load environment variables from a .env file
require("dotenv").config({ path: "Env.env" });
app.use(express.static("public"));

const path = require("path");
app.use(express.static("public"));
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, function () {
    console.log("App started on port 5000");
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});
