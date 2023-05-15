const multer = require("multer");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (file.fieldname === "image") {
      folder = "image";
    } else if (file.fieldname === "video") {
      folder = "video";
    } else if (file.fieldname === "pdf") {
      folder = "pdf";
    }
    cb(null, `uploads/cours/${folder}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    const fileName = `${file.fieldname}_${uniqueSuffix}.${extension}`;
    cb(null, fileName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "image" &&
    !file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)
  ) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  if (
    file.fieldname === "video" &&
    !file.originalname.match(/\.(mp4|avi|mov)$/i)
  ) {
    return cb(new Error("Only video files are allowed!"), false);
  }
  if (file.fieldname === "pdf" && !file.originalname.match(/\.(pdf)$/i)) {
    return cb(new Error("Only PDF files are allowed!"), false);
  }
  cb(null, true);
};

// Multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
