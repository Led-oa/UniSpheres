const express = require("express");

const userRoute = require("./user.route");

const fileRoute = require("./file.route");

const filiereRoute = require("./filiere.route");
const parcoursRoute = require("./parcours.route");
const yearRoute = require("./year.route");

const classeRoute = require("./classe.route");

const courseRoute = require("./course.route");

const conversationRoute = require("./conversation.route");
const messageRoute = require("./message.route");

const api = express.Router();

api.use("/user", userRoute); // ✅

api.use("/file", fileRoute);

api.use("/filiere", filiereRoute); // ✅
api.use("/parcours", parcoursRoute); // ✅
api.use("/year", yearRoute); // ✅

api.use("/classe", classeRoute); // ✅

api.use("/course", courseRoute);

api.use("/conversations", conversationRoute);
api.use("/messages", messageRoute);

module.exports = api;
