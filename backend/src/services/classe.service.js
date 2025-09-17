const ClasseModel = require("../models/classe.model");

const ClasseService = {
  // Récupérer toutes les classes
  async getAllClasses() {
    try {
      const classes = await ClasseModel.getAll();
      return classes;
    } catch (error) {
      console.error("ClasseService.getAllClasses error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  // Récupérer une classe par ID
  async getClasseById(id) {
    try {
      const classe = await ClasseModel.getById(id);
      if (!classe) throw new Error("Classe non trouvée");
      return classe;
    } catch (error) {
      console.error("ClasseService.getClasseById error:", error);
      throw error;
    }
  },

  // Créer une nouvelle classe
  async createClasse(data) {
    try {
      const newClasse = await ClasseModel.create(data);
      return newClasse;
    } catch (error) {
      console.error("ClasseService.createClasse error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  // Mettre à jour une classe
  async updateClasse(id, data) {
    try {
      const updatedClasse = await ClasseModel.update(id, data);
      return updatedClasse;
    } catch (error) {
      console.error("ClasseService.updateClasse error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  // Supprimer une classe
  async deleteClasse(id) {
    try {
      const result = await ClasseModel.delete(id);
      return result;
    } catch (error) {
      console.error("ClasseService.deleteClasse error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
};

module.exports = ClasseService;
