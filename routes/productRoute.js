const express = require("express");
const authService = require("../services/authService");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  setCategoryIdToBody,
  uploadProductImage,
  resizeImage,
} = require("../services/productService");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("superadmin"),
    uploadProductImage,
    resizeImage,
    setCategoryIdToBody,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("superadmin"),
    uploadProductImage,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
