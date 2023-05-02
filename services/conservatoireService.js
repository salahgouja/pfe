const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const Conservatoire = require("../models/conservatoireModel");

exports.getConservatoires = asyncHandler(async (req, res) => {
  const conservatoires = await Conservatoire.find();
  res.status(200).json(conservatoires);
});

exports.getConservatoire = asyncHandler(async (req, res) => {
  const conservatoire = await Conservatoire.findById(req.params.id);
  if (!conservatoire) {
    throw new ApiError("Conservatoire not found", 404);
  }
  res.status(200).json(conservatoire);
});

exports.createConservatoire = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, adressconservatoire, cours } =
    req.body;

  // constconservatoireExists = await Conservatoire.findOne({ name });
  // if (conservatoireExists) {
  //   throw new ApiError("Conservatoire with this name already exists", 400);
  // }

  const conservatoire = new Conservatoire({
    name,
    email,
    password,
    phoneNumber,
    adressconservatoire,
    cours,
  });

  await conservatoire.save();

  res.status(201).json(conservatoire);
});

exports.updateConservatoire = asyncHandler(async (req, res) => {
  const conservatoire = await Conservatoire.findById(req.params.id);
  if (!conservatoire) {
    throw new ApiError("Conservatoire not found", 404);
  }

  const { name, email, password, phoneNumber, adressconservatoire, cours } =
    req.body;

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
  if (cours) {
    conservatoire.cours = cours;
  }

  await conservatoire.save();

  res.status(200).json(conservatoire);
});

exports.deleteConservatoire = asyncHandler(async (req, res) => {
  const conservatoire = await Conservatoire.findById(req.params.id);
  if (!conservatoire) {
    throw new ApiError("Conservatoire not found", 404);
  }

  await Conservatoire.remove({ _id: conservatoire._id });
  res.status(200).json({ message: "Conservatoire removed" });
});
