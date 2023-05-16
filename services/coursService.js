const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { exec } = require("child_process");
const path = require("path");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Cours = require("../models/coursModel");
const Playlist = require("../models/playlistModel");
const Courses = require("../models/coursModel");
const ApiFeatures = require("../utils/apiFeatures");

// // Nested route
// // GET /api/v1/playlists/:playlistId/Cours
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.playlistId) filterObject = { playlist: req.params.CoursId };
  req.filterObj = filterObject;
  next();
};

// // @desc    Get list of Cours
// // @route   GET /api/v1/Cours
// // @access  Public
exports.getCourses = asyncHandler(async (req, res) => {
  //build query
  const apiFeatures = new ApiFeatures(Courses.find(), req.query).search();
  //execute query
  const courses = await apiFeatures.mongooseQuery;
  res.status(200).json({ results: courses, data: courses });
});

// // @desc    Get specific Cours by id
// // @route   GET /api/v1/cours/:id
// // @access  Public
exports.getCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cours = await Cours.findById(id);

  if (!cours) {
    return next(new ApiError(`No cours for this id ${id}`, 404));
  }
  res.status(200).json({ data: cours });
});

exports.setPlaylistIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.playlist) req.body.playlist = req.params.playlistId;
  next();
};

// // @desc    create specific cours
// // @route   post /api/v1/courses/:id
// // @access  Private
exports.createCours = async (req, res) => {
  try {
    const { title, playlist, description, prix } = req.body;
    const newCoursData = {
      title,
      playlist,
      description,
      prix,
    };

    if (req.files["image"]) {
      newCoursData.image = req.files["image"][0].filename;
    }

    if (req.files["video"]) {
      newCoursData.video = req.files["video"][0].filename;
    }

    if (req.files["pdf"]) {
      newCoursData.pdf = req.files["pdf"][0].filename;
    }

    const newCours = await Cours.create(newCoursData);

    Playlist.findByIdAndUpdate(
      playlist,
      { $push: { cours: newCours._id } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        res.status(201).json({
          message: "Cours added successfully",
          data: newCours,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ error: "Unable to update playlist" });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Unable to create cours" });
  }
};

// // @desc    Update specific cours
// // @route   PUT /api/v1/subcategories/:id
// // @access  Private
// Update a specific Cours
exports.updateCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, playlist, description } = req.body;
  const updateFields = { title, playlist, description };

  if (req.files && req.files.image) {
    updateFields.image = req.files.image[0].filename;
  }

  if (req.files && req.files.video) {
    updateFields.video = req.files.video[0].filename;
  }

  if (req.files && req.files.pdf) {
    updateFields.pdf = req.files.pdf[0].filename;
  }

  const updatedCours = await Cours.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedCours) {
    return next(new ApiError(`No cours found for this id: ${id}`, 404));
  }

  res.status(200).json({ data: updatedCours });
});

// // @desc    Delete specific cours
// // @route   DELETE /api/v1/courses/:id
// // @access  Private
exports.deleteCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cours = await Cours.findByIdAndDelete(id);

  if (!cours) {
    return next(new ApiError(`No cours for this id ${id}`, 404));
  }
  res.status(204).send();
});
