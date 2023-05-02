const { number } = require("joi");
const mongoose = require("mongoose");
// 1- Create Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, //"  hh  " trim tna7i el espace ki tzid fil base

      minlength: [2, "Too short Product name"],
      maxlength: [200, "Too long Product name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description required"],
      minlength: [5, "Too short description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price required"],
      trim: true,

      max: [9999, "Too long price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      //required: [true, "Product imageCover required"],
    },
    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product belong to category "],
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
    Brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "rating >= 1"],
      max: [5, "ratin <= 5"],
    },
    ratingqte: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

//exemple for tesst zid el subcategories ki te5dem

// {
//     "title":"Smart Phone" ,
//     "description": "acackjchchj",
//     "quantity":"52" ,
//     "price":"222",
//      "category":"6446aabf8e2ba06f8a2e37aa"
// }
