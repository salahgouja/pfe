const express = require("express");
const authService = require("../services/authService");
const {
  createPlaylistValidator,
  updatePlaylistValidator,
  deletePlaylistValidator,
} = require("../utils/validators/playlistValidator");

const {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  uploadPlaylistImage,
  resizeImage,
} = require("../services/playlistService");

const router = express.Router();
router
  .route("/")
  .get(getPlaylists)
  .post(
    authService.protect,
    authService.allowedTo("teacher", "conservatoire", "superadmin"),
    uploadPlaylistImage,
    resizeImage,
    createPlaylistValidator,
    createPlaylist
  );
router
  .route("/:id")
  .get(getPlaylist)
  .put(
    authService.protect,
    authService.allowedTo("teacher", "conservatoire", "superadmin"),
    uploadPlaylistImage,
    resizeImage,
    updatePlaylistValidator,
    updatePlaylist
  )
  .delete(deletePlaylistValidator, deletePlaylist);
module.exports = router;
