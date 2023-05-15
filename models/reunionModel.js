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
      type: String,
      validate: {
        validator: function (value) {
          // Regular expression to validate the date format (jj/mm/aa)
          return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
        },
        message: "Invalid date format (use jj/mm/aaaa)",
      },
    },
    teachername: {
      type: String,
    },
    time: {
      type: String,
      validate: {
        validator: function (value) {
          // Regular expression to validate the time format (00:00 AM/PM)
          return /^(0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(value);
        },
        message: "Invalid time format (use 00:00 AM/PM)",
      },
    },
    prix: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reunion", reunionSchema);
