const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Admin = require("../../models/userModel");
exports.getAdminValidator = [
  check("id").isMongoId().withMessage("Invalid Admin id format"),
  validatorMiddleware,
];

exports.createAdminValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 3 })
    .withMessage("Too short name"),
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      Admin.findOne({ email: val }).then((admin) => {
        if (admin) {
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
    .isIn(["user", "superadmin", "admin", "teacher"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

exports.updateAdminValidator = [
  check("id").isMongoId().withMessage("Invalid Admin id format"),
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
    .isIn(["user", "superadmin", "admin", "teacher"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

exports.deleteAdminValidator = [
  check("id").isMongoId().withMessage("Invalid Admin id format"),
  validatorMiddleware,
];
