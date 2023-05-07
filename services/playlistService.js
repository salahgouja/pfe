const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const Playlist = require("../models/playlistModel");

exports.getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find();
  res.status(200).json(playlists);
});

exports.getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    throw new ApiError("Playlist not found", 404);
  }
  res.status(200).json(playlist);
});

exports.createPlaylist = asyncHandler(async (req, res) => {
  const { title, cours, image } = req.body;

  const playlistExists = await Playlist.findOne({ title });
  if (playlistExists) {
    throw new ApiError("Playlist with this title already exists", 400);
  }

  const slug = slugify(title, { lower: true });

  const playlist = new Playlist({
    title,
    slug,
    cours,
    image,
  });

  await playlist.save();

  res.status(201).json(playlist);
});

exports.updatePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    throw new ApiError("Playlist not found", 404);
  }

  const { title, cours, image } = req.body;

  if (title) {
    playlist.title = title;
    playlist.slug = slugify(title, { lower: true });
  }

  if (cours) {
    playlist.cours = cours;
  }

  if (image) {
    playlist.image = image;
  }

  await playlist.save();

  res.status(200).json(playlist);
});

exports.deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    throw new ApiError("Playlist not found", 404);
  }

  await Playlist.remove({ _id: playlist._id });
  res.status(200).json({ message: "Playlist removed" });
});
