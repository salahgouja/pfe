const express = require("express");
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
router.route("/").get(getReunions).post(createReunionValidator, createReunion);
router
  .route("/:id")
  .get(getReunion)
  .put(updateReunionValidator, updateReunion)
  .delete(deleteReunionValidator, deleteReunion);
module.exports = router;
