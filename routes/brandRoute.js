const express = require("express");
const authService = require("../services/authService");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("superadmin"),
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("superadmin"),
    updateBrandValidator,
    updateBrand
  )
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
