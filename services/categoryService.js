const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Category = require("../models/categoryModel");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});
// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 5;
  // const skip = (page - 1) * limit;

  const categories = await Category.find({});
  res.status(200).json({ results: categories.length, data: categories });
});

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private

exports.createCategory = asyncHandler(async (req, res) => {
  const { categoryname, subcategory, product } = req.body;
  let { image } = req.body;
  const categoryExists = await Category.findOne({ categoryname });
  if (categoryExists) {
    throw new ApiError("category with this categoryname already exists", 400);
  }
  // If the request contains a file upload, set the image URL to the file path
  if (req.file) {
    image = req.file.path;
  }
  const category = new Category({
    categoryname,
    subcategory,
    product,
    image,
  });

  await category.save();

  res.status(201).json(category);
});
// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { categoryname } = req.body;

  const category = await Category.findOneAndUpdate(
    { _id: id },
    { categoryname },
    { new: true }
  );

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(204).send();
});
