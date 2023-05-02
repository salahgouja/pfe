const mongoose = require("mongoose");

const coursSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,

      minlength: [2, "To short Cours title"],
      maxlength: [32, "To long Cours title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    playlist: {
      type: mongoose.Schema.ObjectId,
      ref: "Playlist",
      required: [true, "Cours must be belong to Playlist"],
    },
    image: String,

    description: { type: String, required: true },
    prix: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cours", coursSchema);
