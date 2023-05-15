const express = require("express");
const authService = require("../services/authService");

const upload = require("../middlewares/upload");
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
  createFilterObj,
} = require("../services/coursService");

const router = express.Router();

// Create a new Cours
router
  .route("/")
  .get(getCourses)
  .post(
    authService.protect,
    authService.allowedTo("teacher", "superadmin"),
    upload.fields([{ name: "image" }, { name: "video" }, { name: "pdf" }]),
    createCoursValidator,
    createCours,
    createFilterObj
  );
router
  .route("/:id")
  .get(getCoursValidator, getCours)
  .put(
    authService.protect,
    authService.allowedTo("teacher", "superadmin"),
    updateCoursValidator,
    updateCours
  )
  .delete(deleteCoursValidator, deleteCours);
module.exports = router;
