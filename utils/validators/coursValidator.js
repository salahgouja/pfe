const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createCoursValidator = [
  check("title")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .isLength({ max: 32 })
    .withMessage("must be max 32 chars")
    .notEmpty()
    .withMessage("Cours required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description").notEmpty().withMessage("Cours description is required"),

  check("prix")
    .notEmpty()
    .withMessage("Cours price is required")
    .isNumeric()
    .withMessage("Cours price must be a number"),
  check("image")
    .optional()
    .isArray()
    .withMessage("image should be array of string"),
  check("pdf")
    .optional()
    .isArray()
    .withMessage("pdf should be array of string"),
  check("video")
    .optional()
    .isArray()
    .withMessage("video should be array of string"),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.getCoursValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

exports.updateCoursValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCoursValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
