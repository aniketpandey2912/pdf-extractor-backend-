const express = require("express");
const fileRouter = express.Router();

fileRouter.get("/", (req, res) => {
  res.send("All Files");
});

module.exports = {
  fileRouter,
};
