const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const ApiFeatures = require("../utils/apiFeatures");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
require("mongoose");
const { query } = require("express");

exports.uploadProductImage = uploadSingleImage("image");
// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `product-${uuidv4()}-${Date.now()}.${req.file.originalname
    .split(".")
    .pop()}`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});
// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
// exports.createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);

//   const product = await Product.create(req.body); //send body as object after slug
//   res.status(201).json({ data: product });
// });
exports.createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    quantity,
    price,
    sold,
    phone,
    priceAfterDiscount,
    category,
    subCategory,
    Brand,
    image,
    ratingsAverage,
    ratingqte,
    etat,
  } = req.body;

  // If the request contains a file upload, set the image URL to the file path
  // if (req.file) {
  //   image = req.file.path;
  // }
  const product = new Product({
    title,
    description,
    quantity,
    price,
    sold,
    phone,
    priceAfterDiscount,
    image,
    category,
    subCategory,
    Brand,
    ratingsAverage,
    ratingqte,
    etat,
  });

  await product.save().then((product) => {
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
});

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});

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

  // const products = await Product.find(req.filterObj);
  // res.status(200).json({ results: products.length, data: products });

  //build query
  const apiFeatures = new ApiFeatures(Product.find(), req.query);
  //execute query
  const products = await apiFeatures.mongooseQuery;
  res.status(200).json(products);
  // //search apiFeatures global function
  // if (req.query.keyword) {
  //   const query = {};
  //   query.$or = [
  //     { title: { $regex: req.query.keyword, $options: "i" } },
  //     { description: { $regex: req.query.keyword, $options: "i" } },
  //   ];
  //   //$regex appartien ou pas
  //   //$options:"i"    capital letters are find same guitar or Guitar
  //   mongooseQuery = mongooseQuery.find(query);
  // }
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
