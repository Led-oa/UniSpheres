// Fichier : /src/models/Year.model.js
const InfoGenerique = require("./InfoGenerique.model");

class YearModel extends InfoGenerique {
  constructor() {
    super("year");
    this.idField = "id_year";
  }

  async getAll() {
    return super.getAll();
  }

  async getById(id) {
    return super.getById(id);
  }

  async create(data) {
    console.log("Model year: data", data);
    return super.create(data);
  }

  async update(id, data) {
    return super.update(this.idField, id, data);
  }

  async delete(id) {
    return super.delete(this.idField, id);
  }
}

module.exports = new YearModel();
