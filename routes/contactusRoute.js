const express = require("express");
const contactusService = require("../services/contactusService");

const router = express.Router();

router.route("/").post(contactusService.sendContactusEmail);

module.exports = router;
