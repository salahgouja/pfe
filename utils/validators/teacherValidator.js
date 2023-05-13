const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
exports.getTeacherValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.createTeacherValidator = [
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
    .isIn(["user", "conservatoire", "teacher"])
    .withMessage("Invalid role"),
  check("image")
    .optional()
    .isArray()
    .withMessage("image should be array of string"),

  validatorMiddleware,
];

exports.updateTeacherValidator = [
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
    .isIn(["user", "conservatoire", "teacher"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

exports.deleteTeacherValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
