const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Playlist = require("../models/playlistModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
// Upload single image
exports.uploadPlaylistImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `playlist-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/playlists/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

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
  const { title, cours, image, prix, description, teacherName } = req.body;

  const playlistExists = await Playlist.findOne({ title });
  if (playlistExists) {
    throw new ApiError("Playlist with this title already exists", 400);
  }

  const playlist = new Playlist({
    title,
    cours,
    image,
    prix,
    description,
    teacherName,
  });

  await playlist.save();

  res.status(201).json({ message: "Playlist created successfully", playlist });
});

exports.updatePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    throw new ApiError("Playlist not found", 404);
  }

  const { title, prix, description, image, teacherName } = req.body;

  if (title) {
    playlist.title = title;
  }

  if (image) {
    playlist.image = image;
  }
  if (prix) {
    playlist.prix = prix;
  }
  if (description) {
    playlist.description = description;
  }
  if (teacherName) {
    playlist.teacherName = teacherName;
  }
  await playlist.save();

  res.status(200).json(playlist);
});

exports.deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    throw new ApiError("Playlist not found", 404);
  }

  await Playlist.deleteOne({ _id: playlist._id });
  res.status(200).json({ message: "Playlist removed" });
});
