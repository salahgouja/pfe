const express = require("express");
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
  uploadCoursImage,
  uploadCoursVideo,
  uploadCoursPdf,
  resizeImage,
  resizeVideo,
  resizePdf,
} = require("../services/coursService");

const router = express.Router();

router.route("/").get(getCourses).post(
  resizeImage,
  resizeVideo,
  resizePdf,
  uploadCoursImage,

  uploadCoursVideo,
  uploadCoursPdf,
  createCoursValidator,
  createCours
);
router
  .route("/:id")
  .get(getCoursValidator, getCours)
  .put(
    uploadCoursImage,
    resizeImage,
    uploadCoursVideo,
    uploadCoursPdf,
    resizeVideo,
    resizePdf,
    updateCoursValidator,
    updateCours
  )
  .delete(deleteCoursValidator, deleteCours);

module.exports = router;
