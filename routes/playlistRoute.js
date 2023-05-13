const express = require("express");
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
    uploadPlaylistImage,
    resizeImage,
    createPlaylistValidator,
    createPlaylist
  );
router
  .route("/:id")
  .get(getPlaylist)
  .put(
    uploadPlaylistImage,
    resizeImage,
    updatePlaylistValidator,
    updatePlaylist
  )
  .delete(deletePlaylistValidator, deletePlaylist);
module.exports = router;
