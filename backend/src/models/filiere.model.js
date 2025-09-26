const InfoGenerique = require("./InfoGenerique.model");

class FiliereModel extends InfoGenerique {
  constructor() {
    super("filiere");
    this.idField = "id_filiere";
  }

  // Récupérer toutes les filières
  async getAll() {
    return super.getAll();
  }

  // Récupérer une filière par ID
  async getById(id) {
    return super.getById(id);
  }

  // Créer une nouvelle filière
  async create(data) {
    return super.create(data);
  }

  // Mettre à jour une filière
  async update(id, data) {
    return super.update(this.idField, id, data);
  }

  // Supprimer une filière
  async delete(id) {
    return super.delete(id);
  }
}

module.exports = new FiliereModel();
