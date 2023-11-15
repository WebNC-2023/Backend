const multer = require("multer");
const path = require("path");
const fs = require("fs");

const SupportedFileType = {
  IMAGE: /jpg|jpeg|png|gif|svg/,
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(path.join(__dirname, "../../uploads"), { recursive: true });
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

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
