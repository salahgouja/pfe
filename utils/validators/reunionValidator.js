const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Reunion = require("../../models/reunionModel");

// Validate reunion creation
exports.createReunionValidator = [
  check("title")
    .notEmpty()
    .withMessage("Reunion title is required.")
    .isLength({ max: 100 })
    .withMessage("Reunion title should be at most 100 characters."),
  check("description")
    .notEmpty()
    .withMessage("Reunion description is required.")
    .isLength({ max: 1000 })
    .withMessage("Reunion description should be at most 1000 characters."),
  check("lien").notEmpty().withMessage("Reunion lien is required."),
  check("date")
    .notEmpty()
    .withMessage("Reunion date is required.")
    .isISO8601()
    .withMessage("Invalid reunion date. Please provide a valid date."),
];
// Validate reunion update
exports.updateReunionValidator = [
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Reunion title is required.")
    .isLength({ max: 100 })
    .withMessage("Reunion title should be at most 100 characters."),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Reunion description is required.")
    .isLength({ max: 1000 })
    .withMessage("Reunion description should be at most 1000 characters."),
  check("lien").notEmpty().withMessage("Reunion lien is required."),
  check("date")
    .notEmpty()
    .withMessage("Reunion date is required.")
    .isISO8601()
    .withMessage("Invalid reunion date. Please provide a valid date."),
];

// Validate reunion deletion
exports.deleteReunionValidator = [
  check("id")
    .notEmpty()
    .withMessage("Reunion ID is required.")
    .isMongoId()
    .withMessage("Invalid reunion ID."),
  asyncHandler(async (req, res, next) => {
    const reunion = await Reunion.findById(req.params.id);
    if (!reunion) {
      return res.status(404).json({
        status: "fail",
        message: "Reunion not found.",
      });
    }
    req.reunion = reunion;
    next();
  }),
];
