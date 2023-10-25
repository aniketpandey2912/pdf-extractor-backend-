// Third Party Imports
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

app.listen(4500, () => {
  console.log("Server running at port", 4500);
});
