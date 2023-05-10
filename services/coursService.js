const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { exec } = require("child_process");
const path = require("path");

const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cours = require("../models/coursModel");
const Playlist = require("../models/playlistModel");
const Courses = require("../models/coursModel");
const ApiFeatures = require("../utils/apiFeatures");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { uploadSinglePdf } = require("../middlewares/uploadPdfMiddleware");
const { uploadSingleVideo } = require("../middlewares/uploadVideoMiddleware");
exports.uploadCoursImage = uploadSingleImage("image");
exports.uploadCoursVideo = uploadSingleVideo("Video");
exports.uploadCoursPdf = uploadSinglePdf("Pdf");
const fs = require("fs");
const util = require("util");
const { body } = require("express-validator");
const unlinkAsync = util.promisify(fs.unlink);

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files) {
      throw new Error("No file provided");
    }

    if (req.fieldname != null && !req.files.mimetype.includes("image")) {
      console.log(req.files.mimetype);
      const filename = `cours-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.files.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/cours/image${filename}`);

      next();
    }

    // req.body.image = filename;

    next();
  } catch (error) {
    next(error);
  }
});

// Video processing
exports.resizeVideo = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files) {
      return next();
    }
    if (!req.files.mimetype.includes("video")) {
      console.log(req.files.mimetype);
      const filename = `cours-${uuidv4()}-${Date.now()}.video`;

      // req.body.video = filename;

      const outputPath = `uploads/cours/video${filename}`;
      const resizeCommand = `ffmpeg -i ${req.files.path} -vf scale=640:480 -c:a copy ${outputPath}`;

      exec(resizeCommand, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error resizing video: ${error.message}`);
          return next(error);
        }
        if (stderr) {
          console.error(`FFmpeg error: ${stderr}`);
          return next(new Error("Failed to resize video."));
        }

        console.log("Video resized successfully.");

        try {
          await unlinkAsync(req.files.path);
          console.log("Original video file deleted.");
          next();
        } catch (error) {
          console.error(`Error deleting original video file: ${error.message}`);
          next(error);
        }
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// PDF processing
exports.resizePdf = asyncHandler(async (req, res, next) => {
  try {
    console.log(req);
    if (!req.files) {
      throw new Error("No file provided");
    }
    if (!req.files.mimetype.includes("pdf")) {
      console.log(req.files.mimetype);
      const filename = `cours-${uuidv4()}-${Date.now()}.pdf`;
      await sharp(req.files.buffer)
        .toFormat("pdf")
        .toFile(`uploads/cours/pdf${filename}`);

      next();
    }

    // req.body.pdf = filename;

    next();
  } catch (error) {
    next(error);
  }
});

// // Image processing
// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const filename = `cours-${uuidv4()}-${Date.now()}.jpeg`;

//   if (req.file) {
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat("jpeg")
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/cours/${filename}`);

//     // Save image into our db
//     req.body.image = filename;
//   }

//   next();
// });
// // Video processing
// exports.resizeVideo = asyncHandler(async (req, res, next) => {
//   const filename = `cours-${uuidv4()}-${Date.now()}.video`;

//   if (req.file) {
//     // Save the video filename into our db
//     req.body.video = filename;

//     // Define the output path and filename for the resized video
//     const outputPath = `uploads/cours/${filename}`;

//     // Resize the video using FFmpeg
//     const resizeCommand = `ffmpeg -i ${req.file.path} -vf scale=640:480 -c:a copy ${outputPath}`;
//     exec(resizeCommand, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error resizing video: ${error.message}`);
//         return next(error);
//       }
//       if (stderr) {
//         console.error(`FFmpeg error: ${stderr}`);
//         return next(new Error("Failed to resize video."));
//       }

//       console.log("Video resized successfully.");

//       // Cleanup the original video file
//       fs.unlink(req.file.path, (err) => {
//         if (err) {
//           console.error(`Error deleting original video file: ${err.message}`);
//           return next(err);
//         }

//         console.log("Original video file deleted.");

//         next();
//       });
//     });
//   } else {
//     next();
//   }
// });
// // Pdf processing

// exports.resizePdf = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       throw new Error("No file provided");
//     }

//     const filename = `cours-${uuidv4()}-${Date.now()}.pdf`;
//     await sharp(req.file.buffer)
//       .toFormat("pdf")
//       .toFile(`uploads/cours/${filename}`);

//     // Save pdf filename into req.body
//     req.body.pdf = filename;

//     next();
//   } catch (error) {
//     next(error);
//   }
// };
exports.setPlaylistIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.playlist) req.body.playlist = req.params.playlistId;
  next();
};

exports.createCours = (req, res) => {
  console.log(body);

  const { title, playlist, description, prix } = req.body;
  const cours = new Cours({
    title,
    playlist,
    description,
    prix,
    image,
    pdf,
    video,
  });

  cours.save().then((cours) => {
    Playlist.findByIdAndUpdate(
      req.body.playlist,
      { $push: { cours: cours._id } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        res
          .status(201)
          .json({ message: "cours added successfully", data: cours });
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ error: "Unable to create cours" });
      });
  });
};

// Nested route
// GET /api/v1/playlists/:playlistId/Cours
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.playlistId) filterObject = { playlist: req.params.CoursId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of Cours
// @route   GET /api/v1/Cours
// @access  Public
exports.getCourses = asyncHandler(async (req, res) => {
  //build query
  const apiFeatures = new ApiFeatures(Courses.find(), req.query).search();
  //execute query
  const courses = await apiFeatures.mongooseQuery;
  res.status(200).json({ results: courses, data: courses });
});

// @desc    Get specific Cours by id
// @route   GET /api/v1/cours/:id
// @access  Public
exports.getCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cours = await Cours.findById(id);

  if (!cours) {
    return next(new ApiError(`No cours for this id ${id}`, 404));
  }
  res.status(200).json({ data: cours });
});

// @desc    Update specific cours
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, playlist, discription, prix, pdf, video } = req.body;

  const cours = await Cours.findOneAndUpdate(
    { _id: id },
    {
      title,
      slug: slugify(title),
      playlist,
      discription,
      prix,
      pdf,
      video,
    },
    { new: true }
  );

  if (!cours) {
    return next(new ApiError(`No  cours for this id ${id}`, 404));
  }
  res.status(200).json({ data: cours });
});

// @desc    Delete specific cours
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCours = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cours = await Cours.findByIdAndDelete(id);

  if (!cours) {
    return next(new ApiError(`No cours for this id ${id}`, 404));
  }
  res.status(204).send();
});
