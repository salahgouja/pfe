const express = require("express");
// const {
//   getTeacherValidator,
//   createTeacherValidator,
//   updateTeacherValidator,
//   deleteTeacherValidator,
// } = require("../utils/validators/teacherValidator");

const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../services/teacherService");

const router = express.Router();

router.route("/").get(getTeachers).post(createTeacher);
router.route("/:id").get(getTeacher).put(updateTeacher).delete(deleteTeacher);

module.exports = router;
