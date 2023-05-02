const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Teacher = require("../models/teacherModel");
const Conservatoire = require("../models/conservatoireModel");
exports.setConservatoireIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.conservatoire)
    req.body.conservatoire = req.params.conservatoireId;
  next();
};

exports.createTeacher = (req, res) => {
  const { name, email, password, phoneNumber, adressteacher, conservatoire } =
    req.body;

  const teacher = new Teacher({
    name,
    email,
    password,
    phoneNumber,
    adressteacher,
    conservatoire,
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
// GET /api/v1/conservatoires/:conservatoireId/teacher
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.conservatoireId)
    filterObject = { conservatoire: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of teacher
// @route   GET /api/v1/teacher
// @access  Public
exports.getTeachers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const teachers = await Cours.find(req.filterObj).skip(skip).limit(limit);

  res.status(200).json({ results: teachers.length, page, data: teachers });
});

// @desc    Get specific Cours by id
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
  const { name, email, password, phoneNumber, adressteacher, conservatoire } =
    req.body;

  const teacher = await Teacher.findOneAndUpdate(
    { _id: id },
    {
      name,
      slug: slugify(name),
      email,
      password,
      phoneNumber,
      adressteacher,
      conservatoire,
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
