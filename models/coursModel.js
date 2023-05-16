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
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: String,
    pdf: String,
    video: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}api/v1/assets/cours/image/${doc.image}`;
    doc.image = imageUrl;
  }
};

coursSchema.post("init", setImageURL);
coursSchema.post("save", setImageURL);

const setVideoURL = (doc) => {
  if (doc.video) {
    const videoUrl = `${process.env.BASE_URL}api/v1/assets/cours/video/${doc.video}`;
    doc.video = videoUrl;
  }
};

coursSchema.post("init", setVideoURL);
coursSchema.post("save", setVideoURL);

const setPdfURL = (doc) => {
  if (doc.pdf) {
    const pdfUrl = `${process.env.BASE_URL}api/v1/assets/cours/pdf/${doc.pdf}`;
    doc.pdf = pdfUrl;
  }
};

coursSchema.post("init", setPdfURL);
coursSchema.post("save", setPdfURL);

module.exports = mongoose.model("Cours", coursSchema);
