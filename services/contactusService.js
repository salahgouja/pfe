const transporter = require("../utils/sendEmail").transporter;

exports.sendContactusEmail = (req, res) => {
  const { nom, email, sujet, description } = req.body;

  const mailOptions = {
    from: email, // Specify the sender's email address
    to: process.env.EMAIL, // Specify the recipient's email address
    subject: "Contact Us Form Submission",
    text: `Name: ${nom}\nEmail: ${email}\nSubject: ${sujet}\nDescription: ${description}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
};
