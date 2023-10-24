const express = require("express");
const fileRouter = express.Router();

fileRouter.get("/", (req, res) => {
  res.send("All Files");
});

// fileRouter.post("/upload", upload.single("file"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }

//     return res.status(200).json({ message: "File uploaded successfully." });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error." });
//   }
// });

module.exports = {
  fileRouter,
};
