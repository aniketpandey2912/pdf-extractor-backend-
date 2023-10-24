const multer = require("multer");
const { v1 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Defining unique the file name for the uploaded file
    const fileName = v1() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
