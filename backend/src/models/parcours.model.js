// Fichier : /src/models/Parcours.model.js
const InfoGenerique = require("./InfoGenerique.model");

class ParcoursModel extends InfoGenerique {
  constructor() {
    super("parcours");
    this.idField = "id_parcours";
  }

  async getAll() {
    return super.getAll();
  }

  async getById(id) {
    return super.getById(id);
  }

  async create(data) {
    return super.create(data);
  }

  async update(id, data) {
    console.log("Model update parcours: data", data);
    return super.update(this.idField, id, data);
  }

  async delete(id) {
    console.log("Delete model parcours : ", id);

    return super.delete(this.idField, id);
  }
}

module.exports = new ParcoursModel();
