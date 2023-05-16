const express = require("express");
const authService = require("../services/authService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

const router = express.Router();

router
  .route("/")
  .get(getUsers)
  .post(
    authService.protect,
    authService.allowedTo("conservatoire", "teacher", "superadmin", "user"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    authService.protect,
    authService.allowedTo("conservatoire", "teacher", "superadmin", "user"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
