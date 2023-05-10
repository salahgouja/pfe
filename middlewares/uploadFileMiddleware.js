const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = (allowedFileTypes) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError("Only specific file types allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleFile = (fieldName, fileType) => {
  let allowedFileTypes = [];

  if (fileType === "image") {
    allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
  } else if (fileType === "video") {
    allowedFileTypes = ["video/mp4", "video/mpeg", "video/quicktime"];
  } else if (fileType === "pdf") {
    allowedFileTypes = ["application/pdf"];
  }

  return multerOptions(allowedFileTypes).single(fieldName);
};
