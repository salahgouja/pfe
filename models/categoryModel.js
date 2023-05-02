const mongoose = require("mongoose");
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    categoryname: {
      type: String,
      trim: true, //"  hh  " trim tna7i el espace ki tzid fil base
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category   categoryname"],
      maxlength: [32, "Too long category categoryname"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    subCategory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    image: String,
  },
  { timestamps: true }
);

// 2- Create model
module.exports = mongoose.model("Category", categorySchema);
