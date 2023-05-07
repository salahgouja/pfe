const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Category = require("../models/categoryModel");

const Product = require("../models/productModel");
// Nested route
// GET /api/v1/products/:productId/Cours
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
// @desc    Get list of Products
// @route   GET /api/v1/Products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 5;
  // const skip = (page - 1) * limit;

  const products = await Product.find(req.filterObj);
  res.status(200).json({ results: products.length, data: products });
});

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});
exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
// exports.createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);

//   const product = await Product.create(req.body); //send body as object after slug
//   res.status(201).json({ data: product });
// });

exports.createProduct = (req, res) => {
  const {
    title,
    description,
    quantity,
    price,
    sold,
    priceAfterDiscount,
    imageCover,
    images,
    category,
    subCategory,
    Brand,
    ratingsAverage,
    ratingqte,
    etat,
  } = req.body;

  const product = new Product({
    title,
    description,
    quantity,
    price,
    sold,
    priceAfterDiscount,
    imageCover,
    images,
    category,
    subCategory,
    Brand,
    ratingsAverage,
    ratingqte,
    etat,
  });

  product.save().then((product) => {
    Category.findByIdAndUpdate(
      req.body.category,
      { $push: { product: product._id } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        res.status(201).json({
          message: "product added successfully",
          data: product,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ error: "Unable to create product" });
      });
  });
};
// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(204).send();
});
