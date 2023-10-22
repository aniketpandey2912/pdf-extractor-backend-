const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({}, { versionKey: false });

const FileModel = mongoose.model("file", fileSchema);

module.exports = {
  FileModel,
};
