const mongoose = require("mongoose");
const multer = require("multer");

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
      required: true,
    },

    description: { type: String, required: true },
    prix: {
      type: Number,
    },
    image: String,

    pdf: {
      fileUrl: String,
    },

    video: {
      videoUrl: String,
    },
  },
  { timestamps: true }
);

/----------------------------------------------------------------------------/;
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = ` ${process.env.BASE_URL}api/v1/assets/cours/image${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
coursSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
coursSchema.post("save", (doc) => {
  setImageURL(doc);
});
/----------------------------------------------------------------------------/;
const setVideoURL = (doc) => {
  if (doc.video) {
    const videoUrl = `${process.env.BASE_URL}api/v1/assets/cours/video${doc.video}`;
    doc.video = videoUrl;
  }
};
// findOne, findAll and update
coursSchema.post("init", (doc) => {
  setVideoURL(doc);
});

// create
coursSchema.post("save", (doc) => {
  setVideoURL(doc);
});
/----------------------------------------------------------------------------/;
const setPdfURL = (doc) => {
  if (doc.pdf) {
    const pdfUrl = `${process.env.BASE_URL}api/v1/assets/cours/pdf${doc.pdf}`;
    doc.pdf = pdfUrl;
  }
};
// findOne, findAll and update
coursSchema.post("init", (doc) => {
  setPdfURL(doc);
});

// create
coursSchema.post("save", (doc) => {
  setPdfURL(doc);
});
module.exports = mongoose.model("Cours", coursSchema);
