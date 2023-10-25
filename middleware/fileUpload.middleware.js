const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Defining unique the file name for the uploaded file
    const fileName = file.originalname;
    // console.log(file);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
