const { date } = require("joi");
const mongoose = require("mongoose");

const reunionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [2, "To short  reunion title"],
      maxlength: [32, "To long  reunion title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
    },
    lien: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reunion", reunionSchema);
