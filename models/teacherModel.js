const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "too short password"],
      select: true, // select :false exclude password from query results
    },

    phoneNumber: String,
    image: String,

    conservatoire: {
      type: mongoose.Schema.ObjectId,
      ref: "Conservatoire",
      required: [true, "Cours must be belong to Conservatoire"],
    },
    role: {
      type: String,
      default: "teacher",
    },
  },

  {
    timestamps: true,
  }
);
// Hash the password before saving the user document
teacherSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt for the hash
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    return next(error);
  }
});
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = ` ${process.env.BASE_URL}api/v1/assets/teachers/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
teacherSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
teacherSchema.post("save", (doc) => {
  setImageURL(doc);
});
module.exports = mongoose.model("Teacher", teacherSchema);
