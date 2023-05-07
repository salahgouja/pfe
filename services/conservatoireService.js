const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const Conservatoire = require("../models/conservatoireModel");

exports.getConservatoires = asyncHandler(async (req, res) => {
  const conservatoires = await Conservatoire.find();
  res
    .status(200)
    .json({ results: conservatoires.length, data: conservatoires });
});

exports.getConservatoire = asyncHandler(async (req, res) => {
  const conservatoire = await Conservatoire.findById(req.params.id);
  if (!conservatoire) {
    throw new ApiError("Conservatoire not found", 404);
  }
  res.status(200).json(conservatoire);
});

// exports.createConservatoire = asyncHandler(async (req, res) => {
//   const { name, email, password, phoneNumber, adressconservatoire, role } =
//     req.body;

// const conservatoireExists = Conservatoire.findOne({ name });
// if (conservatoireExists) {
//   throw new ApiError("Conservatoire with this name already exists", 400);
// }

//   const conservatoire = new Conservatoire({
//     name,
//     email,
//     password,
//     phoneNumber,
//     adressconservatoire,
//     role,
//   });

//   await conservatoire.save();

//   res.status(201).json(conservatoire);
// });
// exports.createConservatoire = (req, res) => {
//   const { name, email, password, phoneNumber, adressconservatoire, role } =
//     req.body;

//   const conservatoire = new Conservatoire({
//     name,
//     email,
//     password,
//     phoneNumber,
//     adressconservatoire,
//     role,
//   });
//   conservatoire.save();
// };
// exports.createConservatoire = asyncHandler(async (req, res) => {
//   const { name, email, password, passwordConfirm, role } = req.body;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(400);
//     throw new Error("Invalid conservatoire input");
//   }

exports.createConservatoire = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm, phoneNumber, role } =
    req.body;

  // const conservatoireExists = await Conservatoire.findOne({ email });
  // if (conservatoireExists) {
  //   res.status(400);
  //   throw new Error("conservatoire already exists");
  // }

  const conservatoire = await Conservatoire.create({
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    role,
  });

  if (conservatoire) {
    res.status(201).json({
      _id: conservatoire._id,
      name: conservatoire.name,
      email: conservatoire.email,
      password: conservatoire.password,
      passwordConfirm: conservatoire.passwordConfirm,
      phoneNumber: conservatoire.phoneNumber,
      role: conservatoire.role,
    });
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

  await Conservatoire.remove({ _id: conservatoire._id });
  res.status(200).json({ message: "Conservatoire removed" });
});
