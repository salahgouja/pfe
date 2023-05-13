const express = require("express");
const authService = require("../services/authService");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, "uploads/cours");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
require("../");
const upload = multer({ storage: storage });
const {
  getCoursValidator,
  createCoursValidator,
  updateCoursValidator,
  deleteCoursValidator,
} = require("../utils/validators/coursValidator");

const {
  getCourses,
  getCours,
  createCours,
  updateCours,
  deleteCours,
  resizeImage,
  resizeVideo,
  resizePdf,
} = require("../services/coursService");

const router = express.Router();

router.route("/").get(getCourses).post(
  authService.protect,
  authService.allowedTo("teacher", "superadmin"),
  upload.array("files", 3),
  resizeImage,
  resizePdf,
  resizeVideo,

  createCoursValidator,
  createCours
);
router
  .route("/:id")
  .get(getCoursValidator, getCours)
  .put(
    authService.protect,
    authService.allowedTo("teacher", "superadmin"),
    upload.array("files", 3),
    // resizeImage,
    resizeVideo,
    resizePdf,
    updateCoursValidator,
    updateCours
  )
  .delete(deleteCoursValidator, deleteCours);

module.exports = router;
