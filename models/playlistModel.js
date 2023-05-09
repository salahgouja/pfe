const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [2, "To short  playlist title"],
      maxlength: [32, "To long  playlist title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    cours: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Cours",
      },
    ],

    image: String,

    prix: {
      type: Number,
      required: [true, "must add price "],
    },
    description: {
      type: String,
    },
    teacherName: {
      type: String,
    },
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = ` ${process.env.BASE_URL}api/v1/assets/playlist/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
playlistSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
playlistSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Playlist", playlistSchema);
