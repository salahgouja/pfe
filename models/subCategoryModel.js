const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    subCategoryname: {
      type: String,
      trim: true, //"  hh  " trim tna7i el espace ki tzid fil base
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "To short SubCategory subCategoryname"],
      maxlength: [32, "To long SubCategory subCategoryname"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to category"],
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SubCategory ||
  mongoose.model("SubCategory", subCategorySchema);
