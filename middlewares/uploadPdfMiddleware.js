const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new ApiError("Only PDF files allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSinglePDF = (uploads) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new ApiError("Only PDF files allowed", 400), false);
      }
    },
  }).single(uploads);

  return upload;
};
exports.uploadMixOfVideos = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);