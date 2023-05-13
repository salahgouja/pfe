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
} = require("../services/teacherService");

const router = express.Router();

router
  .route("/")
  .get(getTeachers)
  .post(
    authService.protect,
    authService.allowedTo("conservatoire", "superadmin"),
    createTeacherValidator,
    createTeacher
  );
router
  .route("/:id")
  .get(getTeacherValidator, getTeacher)
  .put(
    authService.protect,
    authService.allowedTo("conservatoire", "superadmin"),
    updateTeacherValidator,
    updateTeacher
  )
  .delete(deleteTeacherValidator, deleteTeacher);

module.exports = router;
