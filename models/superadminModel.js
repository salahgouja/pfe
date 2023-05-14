const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const superadminSchema = new mongoose.Schema(
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
  },

  {
    timestamps: true,
  }
);
// Hash the password before saving the superadmin document
superadminSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("User", superadminSchema);
