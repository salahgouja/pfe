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
  uploadCoursVideo,
  uploadCoursPdf,
} = require("../services/coursService");

const router = express.Router();

router
  .route("/")
  .get(getCourses)
  .post(uploadCoursVideo, uploadCoursPdf, createCoursValidator, createCours);
router
  .route("/:id")
  .get(getCoursValidator, getCours)
  .put(updateCoursValidator, updateCours)
  .delete(deleteCoursValidator, deleteCours);

module.exports = router;
