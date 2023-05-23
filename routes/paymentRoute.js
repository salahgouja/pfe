const express = require("express");

const { Add, Verify } = require("../services/payementService");

const Router = express.Router();

Router.post("/payement", Add);
Router.post("/payement/:id", Verify);

module.exports = Router;
