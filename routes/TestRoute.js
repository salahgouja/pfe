const express = require("express");

const { Add, Verify } = require("../services/testService");

const Router = express.Router();
Router.post("/", Add);
Router.post("/:id", Verify);

module.exports = Router;
