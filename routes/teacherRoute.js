const express = require("express");
const authService = require("../services/authService");
const {
  getTeacherValidator,
  createTeacherValidator,
  updateTeacherValidator,
  deleteTeacherValidator,
} = require("../utils/validators/teacherValidator");

const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadUserImage,
  resizeImage,
} = require("../services/teacherService");

const router = express.Router();

router.route("/").get(getTeachers).post(
  authService.protect,
  authService.allowedTo("conservatoire", "teacher", "superadmin"),

  createTeacherValidator,
  createTeacher
);
router
  .route("/:id")
  .get(getTeacherValidator, getTeacher)
  .put(
    authService.protect,
    authService.allowedTo("conservatoire", "teacher", "superadmin"),
    uploadUserImage,
    resizeImage,
    updateTeacherValidator,
    updateTeacher
  )
  .delete(deleteTeacherValidator, deleteTeacher);

module.exports = router;
