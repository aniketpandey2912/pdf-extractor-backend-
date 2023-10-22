require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { connection } = require("./config/db.js");
const { fileRouter } = require("./controller/file.routes.js");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Home Page");
});

// files route
app.use("/files", fileRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Can't connect to DB", err);
  }
  console.log("Server running at port", process.env.PORT);
});
