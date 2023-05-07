const asyncHandler = require("express-async-handler");
const SuperAdmin = require("../models/userModel");
const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");
// @desc    Get all superAdmins
// @route   GET /api/superAdmins
// @access  Private/superAdmin
const getSuperAdmins = asyncHandler(async (req, res) => {
  const superAdmins = await SuperAdmin.find({});
  res.json(superAdmins);
});

// @desc    Get superAdmin by ID
// @route   GET /api/superAdmins/:id
// @access  Private/Admin
const getSuperAdmin = asyncHandler(async (req, res) => {
  const superAdmin = await SuperAdmin.findById(req.params.id);

  if (superAdmin) {
    res.json(superAdmin);
  } else {
    res.status(404);
    throw new Error("superAdmin not found");
  }
});

// @desc    Create superAdmin
// @route   POST /api/superAdmins
// @access  Public
const createSuperAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm, phoneNumber, role } =
    req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error("Invalid superAdmin input");
  }

  const superAdminExists = await SuperAdmin.findOne({ email });
  if (superAdminExists) {
    res.status(400);
    throw new Error("superAdmin already exists");
  }

  const superAdmin = await SuperAdmin.create({
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    role,
  });

  if (superAdmin) {
    res.status(201).json({
      _id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      password: superAdmin.password,
      passwordConfirm: superAdmin.passwordConfirm,
      phoneNumber: superAdmin.phoneNumber,
      role: superAdmin.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid superAdmin data");
  }
});

// @desc    Update superAdmin
// @route   PUT /api/superAdmins/:id
// @access  Private/Admin
const updateSuperAdmin = asyncHandler(async (req, res) => {
  const superAdmin = await SuperAdmin.findById(req.params.id);

  if (superAdmin) {
    superAdmin.name = req.body.name || superAdmin.name;
    superAdmin.email = req.body.email || superAdmin.email;
    superAdmin.phoneNumber = req.body.phoneNumber || superAdmin.phoneNumber;
    superAdmin.role = req.body.role || superAdmin.role;

    const updatedSuperAdmin = await superAdmin.save();

    res.json({
      _id: updatedSuperAdmin._id,
      name: updatedSuperAdmin.name,
      email: updatedSuperAdmin.email,
      phoneNumber: updatedSuperAdmin.phoneNumber,
      role: updatedSuperAdmin.role,
    });
  } else {
    res.status(404);
    throw new Error("SuperAdmin not found");
  }
});

// @desc    Delete SuperAdmin
// @route   DELETE /api/SuperAdmins/:id
// @access  Private/Admin
const deleteSuperAdmin = asyncHandler(async (req, res) => {
  const superAdmin = await SuperAdmin.findById(req.params.id);

  if (superAdmin) {
    await superAdmin.remove();
    res.json({ message: "SuperAdmin removed" });
  } else {
    res.status(404);
    throw new Error("SuperAdmin not found");
  }
});

module.exports = {
  getSuperAdmins,
  getSuperAdmin,
  createSuperAdmin,
  updateSuperAdmin,
  deleteSuperAdmin,
};
