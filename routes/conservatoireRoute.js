const express = require("express");
// const {
//   getConservatoireValidator,
//   createConservatoireValidator,
//   updateConservatoireValidator,
//   deleteConservatoireValidator,
// } = require("../utils/validators/conservatoireValidator");

const {
  getConservatoires,
  getConservatoire,
  createConservatoire,
  updateConservatoire,
  deleteConservatoire,
} = require("../services/conservatoireService");

const router = express.Router();

router.route("/").get(getConservatoires).post(createConservatoire);
router
  .route("/:id")
  .get(getConservatoire)
  .put(updateConservatoire)
  .delete(deleteConservatoire);

module.exports = router;
