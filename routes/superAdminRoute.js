const express = require("express");
const {
  getSuperAdminValidator,
  createSuperAdminValidator,
  updateSuperAdminValidator,
  deleteSuperAdminValidator,
} = require("../utils/validators/superAdminValidator");

const {
  getSuperAdmins,
  getSuperAdmin,
  createSuperAdmin,
  updateSuperAdmin,
  deleteSuperAdmin,
} = require("../services/superAdminService");

const router = express.Router();

router
  .route("/")
  .get(getSuperAdmins)
  .post(createSuperAdminValidator, createSuperAdmin);
router
  .route("/:id")
  .get(getSuperAdminValidator, getSuperAdmin)
  .put(updateSuperAdminValidator, updateSuperAdmin)
  .delete(deleteSuperAdminValidator, deleteSuperAdmin);

module.exports = router;
