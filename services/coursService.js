const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cours = require("../models/coursModel");
const Playlist = require("../models/playlistModel");
const Courses = require("../models/coursModel");
const ApiFeatures = require("../utils/apiFeatures");

const { uploadSinglePDF } = require("../middlewares/uploadPdfMiddleware");
const { uploadSingleVideo } = require("../middlewares/uploadVideoMiddleware");

exports.uploadCoursVideo = uploadSingleVideo("Video");
exports.uploadCoursPdf = uploadSinglePDF("PDF");

exports.setPlaylistIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.playlist) req.body.playlist = req.params.playlistId;
  next();
};

exports.createCours = (req, res) => {
  const { title, playlist, description, prix, pdfFiles, videoTutorials } =
    req.body;

  const cours = new Cours({
    title,
    playlist,
    description,
    prix,
    pdfFiles,
    videoTutorials,
  });

  cours.save().then((cours) => {
    Playlist.findByIdAndUpdate(
      req.body.playlist,
      { $push: { cours: cours._id } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        res
          .status(201)
          .json({ message: "cours added successfully", data: cours });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ error: "Unable to create cours" });
      });
  });
};

// Nested route
// GET /api/v1/playlists/:playlistId/Cours
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.playlistId) filterObject = { playlist: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of Cours
// @route   GET /api/v1/Cours
// @access  Public
exports.getCourses = asyncHandler(async (req, res) => {
  //build query
  const apiFeatures = new ApiFeatures(Courses.find(), req.query).search();
  //execute query
  const courses = await apiFeatures.mongooseQuery;
  res.status(200).json(courses);
});

// @desc    Get specific Cours by id
// @route   GET /api/v1/cours/:id
// @access  Public
exports.getCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cours = await Cours.findById(id);

  if (!cours) {
    return next(new ApiError(`No cours for this id ${id}`, 404));
  }
  res.status(200).json({ data: cours });
});

// @desc    Update specific cours
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, playlist, discription, prix, pdfFiles, videoTutorials } =
    req.body;

  const cours = await Cours.findOneAndUpdate(
    { _id: id },
    {
      title,
      slug: slugify(title),
      playlist,
      discription,
      prix,
      pdfFiles,
      videoTutorials,
    },
    { new: true }
  );

  if (!cours) {
    return next(new ApiError(`No  cours for this id ${id}`, 404));
  }
  res.status(200).json({ data: cours });
});

// @desc    Delete specific cours
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cours = await Cours.findByIdAndDelete(id);

  if (!cours) {
    return next(new ApiError(`No cours for this id ${id}`, 404));
  }
  res.status(204).send();
});
