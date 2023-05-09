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
    },

    description: { type: String, required: true },
    prix: {
      type: Number,
    },

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
    const imageUrl = ` ${process.env.BASE_URL}api/v1/assets/cours/${doc.image}`;
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
    const videoUrl = `${process.env.BASE_URL}api/v1/assets/cours/${doc.video}`;
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
    const pdfUrl = `${process.env.BASE_URL}api/v1/assets/cours/${doc.pdf}`;
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
