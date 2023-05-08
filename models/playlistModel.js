const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [2, "To short  playlist title"],
      maxlength: [32, "To long  playlist title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    cours: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Cours",
      },
    ],

    image: String,

    prix: {
      type: Number,
      required: [true, "must add price "],
    },
    description: {
      type: String,
    },
    teacherName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
