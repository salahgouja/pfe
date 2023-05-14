const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,

      minlength: [2, "To short Contactus nom"],
      maxlength: [32, "To long Contactus nom"],
    },
    email: { type: String, required: true },

    sujet: { type: String, required: true },

    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contactus", contactusSchema);
