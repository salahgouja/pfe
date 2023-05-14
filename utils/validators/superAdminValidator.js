const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const SuperAdmin = require("../../models/userModel");
exports.getSuperAdminValidator = [
  check("id").isMongoId().withMessage("Invalid SuperAdmin id format"),
  validatorMiddleware,
];

exports.createSuperAdminValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name required")
    .isLength({ min: 3 })
    .withMessage("Too short name"),
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      SuperAdmin.findOne({ email: val }).then((superAdmin) => {
        if (superAdmin) {
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

  check("role")
    .optional()
    .isIn(["user", "superadmin", "conservatoire", "teacher"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

exports.updateSuperAdminValidator = [
  check("id").isMongoId().withMessage("Invalid superAdmin id format"),
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
    .isIn(["user", "superadmin", "conservatoire", "teacher"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

exports.deleteSuperAdminValidator = [
  check("id").isMongoId().withMessage("Invalid superAdmin id format"),
  validatorMiddleware,
];
