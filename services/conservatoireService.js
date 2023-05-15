const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const mongoose = require("mongoose");
const ApiFeatures = require("../utils/apiFeatures");

const Conservatoire = require("../models/conservatoireModel");
// const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");
exports.getConservatoires = asyncHandler(async (req, res) => {
  //build query
  const apiFeatures = new ApiFeatures(Conservatoire.find(), req.query);
  //execute query
  const conservatoires = await apiFeatures.mongooseQuery;
  res.status(200).json(conservatoires);
});
exports.getConservatoire = asyncHandler(async (req, res) => {
  const conservatoire = await Conservatoire.findById(req.params.id);
  if (!conservatoire) {
    throw new ApiError("Conservatoire not found", 404);
  }
  res.status(200).json(conservatoire);
});

// exports.createConservatoire = asyncHandler(async (req, res) => {
//   const { name, email, password, passwordConfirm, phoneNumber, role } =
//     req.body;

//   const conservatoireExists = await Conservatoire.findOne({ email });
//   if (conservatoireExists) {
//     res.status(400);
//     throw new Error("conservatoire already exists");
//   }

//   const conservatoire = await Conservatoire.create({
//     name,
//     email,
//     password,
//     passwordConfirm,
//     phoneNumber,
//     role,
//   });

//   if (conservatoire) {
//     res.status(201).json({
//       _id: conservatoire._id,
//       name: conservatoire.name,
//       email: conservatoire.email,
//       password: conservatoire.password,
//       passwordConfirm: conservatoire.passwordConfirm,
//       phoneNumber: conservatoire.phoneNumber,
//       role: conservatoire.role,
//     });

//     conservatoire.save();
//   } else {
//     res.status(400);
//     throw new Error("Invalid conservatoire data");
//   }
// });
exports.createConservatoire = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm, phoneNumber, role } =
    req.body;

  const conservatoireExists = await Conservatoire.findOne({ email });
  if (conservatoireExists) {
    res.status(400);
    throw new Error("conservatoire already exists");
  }

  const conservatoire = await Conservatoire.create({
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    role,
  });

  // Generate token
  const token = createToken(conservatoire._id);

  if (conservatoire) {
    // Send response to the client with the token
    res.status(201).json({
      data: conservatoire,
      token,
    });

    conservatoire.save();
  } else {
    res.status(400);
    throw new Error("Invalid conservatoire data");
  }
});

exports.updateConservatoire = asyncHandler(async (req, res) => {
  const conservatoire = await Conservatoire.findById(req.params.id);
  if (!conservatoire) {
    throw new ApiError("Conservatoire not found", 404);
  }

  const { name, email, password, phoneNumber, adressconservatoire } = req.body;

  if (name) {
    conservatoire.name = name;
    conservatoire.slug = slugify(name, { lower: true });
  }

  if (email) {
    conservatoire.email = email;
  }
  if (password) {
    conservatoire.password = password;
  }
  if (phoneNumber) {
    conservatoire.phoneNumber = phoneNumber;
  }
  if (adressconservatoire) {
    conservatoire.adressconservatoire = adressconservatoire;
  }

  await conservatoire.save();

  res.status(200).json(conservatoire);
});

exports.deleteConservatoire = asyncHandler(async (req, res) => {
  const conservatoire = await Conservatoire.findById(req.params.id);
  if (!conservatoire) {
    throw new ApiError("Conservatoire not found", 404);
  }

  await Conservatoire.deleteOne({ _id: conservatoire._id });
  res.status(200).json({ message: "Conservatoire removed" });
});
