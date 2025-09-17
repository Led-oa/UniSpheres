const InfoGeneriqueService = require("./InfoGenerique.service");
const ParcoursModel = require("../models/parcours.model");

const ParcoursService = new InfoGeneriqueService(ParcoursModel);

module.exports = ParcoursService;
