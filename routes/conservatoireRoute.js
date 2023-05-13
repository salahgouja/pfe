const express = require("express");
const authService = require("../services/authService");

const {
  getConservatoireValidator,
  createConservatoireValidator,
  updateConservatoireValidator,
  deleteConservatoireValidator,
} = require("../utils/validators/conservatoireValidator");

const {
  getConservatoires,
  getConservatoire,
  createConservatoire,
  updateConservatoire,
  deleteConservatoire,
} = require("../services/conservatoireService");

const router = express.Router();

router
  .route("/")
  .get(getConservatoires)
  .post(
    authService.protect,
    authService.allowedTo("superadmin"),
    createConservatoireValidator,
    createConservatoire
  );
router
  .route("/:id")
  .get(getConservatoireValidator, getConservatoire)
  .put(
    authService.protect,
    authService.allowedTo("superadmin"),
    updateConservatoireValidator,
    updateConservatoire
  )
  .delete(deleteConservatoireValidator, deleteConservatoire);

module.exports = router;
