const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 3 })
    .withMessage("Too short name"),
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Too short password")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error(" Defferent password and passwordConfirmation ");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("phoneNumber")
    .optional()
    .isMobilePhone("ar-TN")
    .withMessage("only accept tunisian numbers"),

  check("role")
    .optional()
    .isIn(["user", "conservatoire", "teacher", "superadmin"])
    .withMessage("Invalid role"),
  // check("image")
  //   .optional()
  //   .isArray()
  //   .withMessage("image should be array of string"),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 3 })
    .withMessage("Too short name")
    .isLength({ max: 32 })
    .withMessage("Too long name"),
  check("email").optional().isEmail().withMessage("Invalid email"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Too short password"),
  check("role")
    .optional()
    .isIn(["superadmin", "user", "conservatoire", "teacher"])
    .withMessage("Invalid role"),

  // check("playlist")
  //   .isArray({ min: 1 })
  //   .withMessage("At least one playliste is required.")
  //   .custom(async (playlist) => {
  //     const invalidPlaylistIds = [];
  //     for (const playlistId of playlist) {
  //       const playlist = await playlist.findById(playlistId);
  //       if (!playlist) {
  //         invalidPlaylistIds.push(playlistId);
  //       }
  //     }
  //     if (invalidPlaylistIds.length > 0) {
  //       throw new Error(
  //         `Invalid playlist IDs: ${invalidPlaylistIds.join(", ")}`
  //       );
  //     }
  //   }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
