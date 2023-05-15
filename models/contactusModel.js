const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      minlength: [2, "Too short Contactus nom"],
      maxlength: [32, "Too long Contactus nom"],
    },
    email: { type: String, required: true },
    sujet: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Contactus = mongoose.model("Contactus", contactusSchema);

module.exports = Contactus;
