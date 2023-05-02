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
} = require("../services/playlistService");

const router = express.Router();
router
  .route("/")
  .get(getPlaylists)
  .post(createPlaylistValidator, createPlaylist);
router
  .route("/:id")
  .get(getPlaylist)
  .put(updatePlaylistValidator, updatePlaylist)
  .delete(deletePlaylistValidator, deletePlaylist);
module.exports = router;
