const express = require("express");

const { Add1, Verify1 } = require("../services/test1Service");

const Router = express.Router();
Router.post("/", Add1);
Router.post("/:id", Verify1);

module.exports = Router;
