const multer = require("multer");
const path = require("path");

const SupportedFileType = {
  IMAGE: /jpg|jpeg|png|gif|svg/,
};

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const isImage = SupportedFileType.IMAGE.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isImage) {
    return cb(null, true);
  } else {
    cb("Error: Unsupported file type!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 20000000 }, // 20MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
