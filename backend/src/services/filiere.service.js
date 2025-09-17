const InfoGeneriqueService = require("./InfoGenerique.service");
const FiliereModel = require("../models/filiere.model");

const FiliereService = new InfoGeneriqueService(FiliereModel);

module.exports = FiliereService;
