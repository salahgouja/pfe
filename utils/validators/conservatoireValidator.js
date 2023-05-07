const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Conservatoire = require("../../models/userModel");
exports.getConservatoireValidator = [
  check("id").isMongoId().withMessage("Invalid Conservatoire id format"),
  validatorMiddleware,
];

exports.createConservatoireValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 3 })
    .withMessage("Too short name"),
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      Conservatoire.findOne({ email: val }).then((conservatoire) => {
        if (conservatoire) {
          return Promise.reject(
            new Error("e-mail already exist try to sign in ")
          );
        }
      })
    ),
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
    .isIn(["user", "superconservatoire", "conservatoire", "teacher"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

exports.updateConservatoireValidator = [
  check("id").isMongoId().withMessage("Invalid Conservatoire id format"),
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
    .isIn(["user", "superconservatoire", "conservatoire", "teacher"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

exports.deleteConservatoireValidator = [
  check("id").isMongoId().withMessage("Invalid Conservatoire id format"),
  validatorMiddleware,
];
