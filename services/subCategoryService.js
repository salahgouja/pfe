const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const SubCategory = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");
exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createSubCategory = (req, res) => {
  const { subCategoryname, category } = req.body;

  const subCategory = new SubCategory({
    subCategoryname,
    category,
  });

  subCategory.save().then((subCategory) => {
    Category.findByIdAndUpdate(
      req.body.category,
      { $push: { subCategory: subCategory._id } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        res.status(201).json({
          message: "subCategory added successfully",
          data: subCategory,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ error: "Unable to create subCategory" });
      });
  });
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.find(req.filterObj);
  // .populate({ path: 'category', select: 'subCategoryname -_id' });

  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);

  if (!subCategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { subCategoryname, category } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { subCategoryname, slug: slugify(subCategoryname), category },
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`No  subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(204).send();
});
