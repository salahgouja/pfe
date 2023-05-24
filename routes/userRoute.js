const express = require("express");
const userService = require("../services/userService");
const asyncHandler = require("express-async-handler");
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

router.route("/").get(getUsers).post(
  // authService.protect,
  // authService.allowedTo("conservatoire", "teacher", "superadmin", "user"),
  uploadUserImage,
  resizeImage,
  createUserValidator,
  createUser
);
router.post("/:userId/playlists/:playlistId", async (req, res) => {
  const { userId, playlistId } = req.params;

  try {
    const result = await userService.assignPlaylistToUser(userId, playlistId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Unable to assign playlist" });
  }
});

router.get(
  "/:userId/playlists",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await userService.getUserPlaylists(userId);
      res.status(200).json({
        message: "User playlists retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Unable to retrieve user playlists" });
    }
  })
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
  .delete(
    // authService.protect,
    // authService.allowedTo("conservatoire", "teacher", "superadmin", "user"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
