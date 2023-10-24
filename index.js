// Third Party Imports
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const { PDFDocument, rgb } = require("pdf-lib");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

// Local Imports
const { connection } = require("./config/db.js");
const { fileRouter } = require("./controller/file.routes.js");
const app = express();

app.use(express.json());
app.use(cors());

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory where files will be stored
    cb(null, "uploads/"); // You should create this folder in your project directory
  },
  filename: (req, file, cb) => {
    // Define the file name for the uploaded file
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Home Page");
});

// files route
// app.use("/files", fileRouter);

// Upload
app.post("/upload", upload.single("file"), (req, res) => {
  // Check if req.file is defined
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Use path.resolve to get an absolute path
  const absolutePath = path.resolve(req.file.path);

  // Send the uploaded file as a response
  res.sendFile(absolutePath);
});

// Extaction of selected pages
app.post("/extract", async (req, res) => {
  try {
    // Check if 'filename' and 'selectedPages' are provided in the request body
    if (
      !req.body.filename ||
      !req.body.selectedPages ||
      !Array.isArray(req.body.selectedPages)
    ) {
      return res.status(400).json({
        message:
          "Invalid request. Please provide 'filename' and 'selectedPages'.",
      });
    }

    // Check if the provided 'filename' exists in the 'uploads' directory
    const filePath = path.join(__dirname, "uploads", req.body.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found." });
    }

    // Load the original uploaded PDF by filename
    const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));

    const extractedPdfDoc = await PDFDocument.create(); // Create a new PDF document

    for (const pageIndex of req.body.selectedPages) {
      if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) {
        return res
          .status(400)
          .json({ message: "Invalid page index provided." });
      }

      const [page] = await extractedPdfDoc.copyPages(pdfDoc, [pageIndex]);
      extractedPdfDoc.addPage(page);
    }

    const extractedPdfBytes = await extractedPdfDoc.save(); // Save the extracted PDF

    fs.writeFileSync("output.pdf", extractedPdfBytes);

    console.log(extractedPdfBytes);

    // Set the response headers for the PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=extracted.pdf");

    // Send the extracted PDF as a response
    res.send(extractedPdfBytes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error extracting PDF", error: err.message });
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Can't connect to DB", err);
  }
  console.log("Server running at port", process.env.PORT);
});
