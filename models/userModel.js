const { boolean } = require("joi");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ["user", "conservatoire", "teacher"],
      default: "user",
    },
  },

  {
    timestamps: true,
  }
);
// Hash the password before saving the user document
userSchema.pre("save", async function (next) {
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

const User = mongoose.model("User", userSchema);
module.exports = User;

// const superadminModel = new mongoose.Schema({});
// const SuperAdmin = userSchema.discriminator("SuperAdmin", superadminModel);

// const conservatoireModel = new mongoose.Schema({
//   addressconservatoire: {
//     type: String,
//   },
// });
// const Conservatoire = userSchema.discriminator(
//   "Conservatoire",
//   conservatoireModel
// );

// const NormalUserModel = new mongoose.Schema({
//   address: {
//     type: String,
//   },
// });
// const NormalUser = userSchema.discriminator("NormalUser", NormalUserModel);

// const teacherModel = new mongoose.Schema({
//   specialite: {
//     type: String,
//   },
// });
// const Teacher = userSchema.discriminator("teacher", teacherModel);

// module.exports = { SuperAdmin, Conservatoire, NormalUser, Teacher };
