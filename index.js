// Third Party Imports
require("dotenv").config();
const cors = require("cors");
const express = require("express");

// Local Imports
const { fileRouter } = require("./controller/file.routes.js");

// App Instance
const app = express();

app.use(express.json());
app.use(cors());

// Home route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// file route - upload, extract
app.use("/file", fileRouter);

app.listen(4500, async () => {
  try {
    // await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Can't connect to DB", err);
  }
  console.log("Server running at port", 4500);
});
