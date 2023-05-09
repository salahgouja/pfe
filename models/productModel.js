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
      default: 1,
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
    etat: {
      type: String,
      enum: ["nouveau", "occasion"],
      default: "nouveau",
      required: [true, "L' etat du product required"],
    },
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}api/v1/assets/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((images) => {
      const imageUrl = `${process.env.BASE_URL}api/v1/assets/products/${images}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
// findOne, findAll and update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
