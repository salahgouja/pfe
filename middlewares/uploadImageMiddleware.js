const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  console.log("inside upload images !");
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    console.log("this is file ==> ", file);
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (filename) => multerOptions().single(filename);
