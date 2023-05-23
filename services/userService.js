const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const Playlist = require("../models/playlistModel");
const authService = require("../services/authService");

const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
// Upload single image
exports.uploadUserImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.${req.file.originalname
    .split(".")
    .pop()}`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

exports.assignPlaylistToUser = asyncHandler(async (userId, playlistId) => {
  // Find the user and playlist documents by their respective IDs
  const user = await User.findById(userId);
  const playlist = await Playlist.findById(playlistId);

  // Check if the user and playlist exist
  if (!user) {
    throw new Error("User not found");
  }
  if (!playlist) {
    throw new Error("Playlist not found");
  }

  // Assign the playlist to the user's playlist array
  user.playlist.push(playlistId);

  // Save the updated user document
  await user.save();

  return {
    message: "Playlist assigned successfully",
    data: user,
  };
});
exports.getUserPlaylists = asyncHandler(async (userId) => {
  try {
    // Find the user by their ID and populate the 'playlist' field
    const user = await User.findById(userId).populate("playlist");

    if (!user) {
      throw new Error("User not found");
    }

    // Extract the playlists from the user object
    const playlists = user.playlist;
    console.log("playlists", playlists);

    return playlists;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Unable to retrieve user playlists");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/user
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ data: users });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Create user
// @route   POST /api/users
// @access  Public
exports.createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    playlist,
    role,
  } = req.body;
  let { image } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error("Invalid user input");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    image,
    playlist,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      passwordConfirm: user.passwordConfirm,
      phoneNumber: user.phoneNumber,
      image: user.image,
      playlist: user.playlist,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.image = req.body.image || user.image;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      image: updatedUser.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne(); // Updated method for deleting a document
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
