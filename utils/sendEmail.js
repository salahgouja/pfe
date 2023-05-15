const nodemailer = require("nodemailer");

// Create a Nodemailer transporter using MailDev
exports.transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  ignoreTLS: true,
});
