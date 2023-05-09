const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Playlist = require("../../models/playlistModel");
const Cours = require("../../models/coursModel");

// Validate playlist creation
exports.createPlaylistValidator = [
  check("title")
    .notEmpty()
    .withMessage("Playlist title is required.")
    .isLength({ max: 100 })
    .withMessage("Playlist title should be at most 100 characters."),
  check("description")
    .notEmpty()
    .withMessage("Playlist description is required.")
    .isLength({ max: 1000 })
    .withMessage("Playlist description should be at most 1000 characters."),
  check("image")
    .optional()
    .isArray()
    .withMessage("image should be array of string"),
  check("teacherName")
    .isLength({ max: 20 })
    .withMessage("Playlist teacherName should be at most 20 characters."),
  check("cours")
    .isArray({ min: 1 })
    .withMessage("At least one course is required.")
    .custom(async (cours) => {
      const invalidCoursIds = [];
      for (const coursId of cours) {
        const cours = await Cours.findById(coursId);
        if (!cours) {
          invalidCoursIds.push(coursId);
        }
      }
      if (invalidCoursIds.length > 0) {
        throw new Error(`Invalid cours IDs: ${invalidCoursIds.join(", ")}`);
      }
    }),
];

// Validate playlist update
exports.updatePlaylistValidator = [
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Playlist title is required.")
    .isLength({ max: 100 })
    .withMessage("Playlist title should be at most 100 characters."),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Playlist description is required.")
    .isLength({ max: 1000 })
    .withMessage("Playlist description should be at most 1000 characters."),
  check("courses")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one cours is required.")
    .custom(async (cours) => {
      const invalidCoursIds = [];
      for (const coursId of cours) {
        const cours = await Cours.findById(coursId);
        if (!cours) {
          invalidCoursIds.push(coursId);
        }
      }
      if (invalidCoursIds.length > 0) {
        throw new Error(`Invalid course IDs: ${invalidCoursIds.join(", ")}`);
      }
    }),
];

// Validate playlist deletion
exports.deletePlaylistValidator = [
  check("id")
    .notEmpty()
    .withMessage("Playlist ID is required.")
    .isMongoId()
    .withMessage("Invalid playlist ID."),
  asyncHandler(async (req, res, next) => {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({
        status: "fail",
        message: "Playlist not found.",
      });
    }
    req.playlist = playlist;
    next();
  }),
];
