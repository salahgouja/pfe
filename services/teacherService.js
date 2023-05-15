const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const mongoose = require("mongoose");
const ApiFeatures = require("../utils/apiFeatures");

const Teacher = require("../models/teacherModel");
const Conservatoire = require("../models/conservatoireModel");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
// Upload single image
exports.uploadUserImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `teacher-${uuidv4()}-${Date.now()}.${req.file.originalname
    .split(".")
    .pop()}`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/teachers/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

exports.setConservatoireIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.conservatoire)
    req.body.conservatoire = req.params.conservatoireId;
  next();
};

exports.createTeacher = (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    adressteacher,
    conservatoire,
    role,
  } = req.body;
  // Check if the conservatoire value is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(conservatoire)) {
    return res.status(400).json({ error: "Invalid conservatoire ID" });
  }
  const teacher = new Teacher({
    name,
    email,
    password,
    phoneNumber,
    adressteacher,
    conservatoire,
    role,
  });

  teacher.save().then((teacher) => {
    Conservatoire.findByIdAndUpdate(
      req.body.conservatoire,
      { $push: { teacher: teacher._id } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        res
          .status(201)
          .json({ message: "teacher added successfully", data: teacher });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ error: "Unable to create teacher" });
      });
  });
};

// Nested route
// GET /api/v1/teachers/:teacherId/teacher
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.teacherId) filterObject = { teacher: req.params.teacherId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of teachers
// @route   GET /api/v1/teacher
// @access  Public

exports.getTeachers = asyncHandler(async (req, res) => {
  //build query
  const apiFeatures = new ApiFeatures(Teacher.find(), req.query);
  //execute query
  const teachers = await apiFeatures.mongooseQuery;
  res.status(200).json(teachers);
});

// @desc    Get specific teachers by id
// @route   GET /api/v1/teacher/:id
// @access  Public
exports.getTeacher = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);

  if (!teacher) {
    return next(new ApiError(`No teacher for this id ${id}`, 404));
  }
  res.status(200).json({ data: teacher });
});

// @desc    Update specific teacher
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateTeacher = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    phoneNumber,
    adressteacher,
    image,
    conservatoire,
    role,
  } = req.body;

  const teacher = await Teacher.findOneAndUpdate(
    { _id: id },
    {
      name,
      email,
      password,
      phoneNumber,
      adressteacher,
      image,
      conservatoire,
      role,
    },
    { new: true }
  );

  if (!teacher) {
    return next(new ApiError(`No  teacher for this id ${id}`, 404));
  }
  res.status(200).json({ data: teacher });
});

// @desc    Delete specific teacher
// @route   DELETE /api/v1/teacheres/:id
// @access  Private
exports.deleteTeacher = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const teacher = await Teacher.findByIdAndDelete(id);

  if (!teacher) {
    return next(new ApiError(`No teacher for this id ${id}`, 404));
  }
  res.status(204).send();
});
