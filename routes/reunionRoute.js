const express = require("express");
const authService = require("../services/authService");
const {
  createReunionValidator,
  updateReunionValidator,
  deleteReunionValidator,
} = require("../utils/validators/reunionValidator");

const {
  getReunions,
  getReunion,
  createReunion,
  updateReunion,
  deleteReunion,
} = require("../services/reunionService");

const router = express.Router();
router
  .route("/")
  .get(getReunions)
  .post(
    authService.protect,
    authService.allowedTo("teacher", "superadmin"),
    createReunionValidator,
    createReunion
  );
router
  .route("/:id")
  .get(getReunion)
  .put(
    authService.protect,
    authService.allowedTo("teacher", "superadmin"),
    updateReunionValidator,
    updateReunion
  )
  .delete(deleteReunionValidator, deleteReunion);
module.exports = router;
