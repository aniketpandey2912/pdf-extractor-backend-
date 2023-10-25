// Third Party Imports
const { PDFDocument } = require("pdf-lib");
const express = require("express");
const fileRouter = express.Router();

// Local Imports
const path = require("path");
const fs = require("fs");
const { upload } = require("../middleware/fileUpload.middleware");

// Defining the directory for the uploaded and extracted files
const uploadsDir = path.join(__dirname, "../uploads");
const outputsDir = path.join(__dirname, "../outputs");

// File Upload Route
fileRouter.post("/upload", upload.single("file"), (req, res) => {
  // Check if req.file is defined
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Use path.resolve to get an absolute path
  const absolutePath = path.resolve(req.file.path);

  // Send the uploaded file as a response
  res.sendFile(absolutePath);
});

// Page Extraction Route
fileRouter.post("/extract", async (req, res) => {
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
    const filePath = path.join(uploadsDir, req.body.filename);

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

      const [page] = await extractedPdfDoc.copyPages(pdfDoc, [pageIndex]); // 0 based indexing and from frontend we'll expect 1 based indexed pages
      extractedPdfDoc.addPage(page);
    }

    const extractedPdfBytes = await extractedPdfDoc.save(); // Save the extracted PDF

    // Define the output path for the extracted PDF
    const outputPath = path.join(
      outputsDir,
      `${req.body.filename}-extracted.pdf`
    );

    // Write the extracted PDF to the server's disk
    fs.writeFileSync(outputPath, extractedPdfBytes);

    // Set the response headers for the PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${req.body.filename}-extracted.pdf`
    );

    // Send the extracted PDF as a response
    res.sendFile(outputPath);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error extracting PDF", error: err.message });
  }
});

module.exports = {
  fileRouter,
};
