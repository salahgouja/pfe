const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const Reunion = require("../models/reunionModel");

exports.getReunions = asyncHandler(async (req, res) => {
  const reunions = await Reunion.find();
  res.status(200).json(reunions);
});

exports.getReunion = asyncHandler(async (req, res) => {
  const reunion = await Reunion.findById(req.params.id);
  if (!reunion) {
    throw new ApiError("Reunion not found", 404);
  }
  res.status(200).json(reunion);
});

exports.createReunion = asyncHandler(async (req, res) => {
  const { title, description, lien, date } = req.body;

  const reunionExists = await Reunion.findOne({ title });
  if (reunionExists) {
    throw new ApiError("Reunion with this title already exists", 400);
  }

  const slug = slugify(title, { lower: true });

  const reunion = new Reunion({
    title,
    slug,
    description,
    lien,
    date,
  });

  await reunion.save();

  res.status(201).json(reunion);
});

exports.updateReunion = asyncHandler(async (req, res) => {
  const reunion = await Reunion.findById(req.params.id);
  if (!reunion) {
    throw new ApiError("Reunion not found", 404);
  }

  const { title, description, lien, date } = req.body;

  if (title) {
    reunion.title = title;
    reunion.slug = slugify(title, { lower: true });
  }

  if (description) {
    reunion.description = description;
  }

  if (lien) {
    reunion.lien = lien;
  }
  if (date) {
    reunion.date = date;
  }

  await reunion.save();

  res.status(200).json(reunion);
});

exports.deleteReunion = asyncHandler(async (req, res) => {
  const reunion = await Reunion.findById(req.params.id);
  if (!reunion) {
    throw new ApiError("Reunion not found", 404);
  }

  await Reunion.deleteOne({ _id: reunion._id });
  res.status(200).json({ message: "Reunion removed" });
});
