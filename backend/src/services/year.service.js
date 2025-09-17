const InfoGeneriqueService = require("./InfoGenerique.service");
const YearModel = require("../models/year.model");

const YearService = new InfoGeneriqueService(YearModel);

module.exports = YearService;
