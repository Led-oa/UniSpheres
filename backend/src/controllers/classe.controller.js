// Fichier: /src/controllers/Classe.controller.js
const ClasseService = require("../services/classe.service");

const ClasseController = {
  // Récupérer toutes les classes
  async getAllClasses(req, res) {
    try {
      const classes = await ClasseService.getAllClasses();

    //   console.log("Controller classe: ", classes);

      res.json({ success: true, data: classes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer une classe par ID
  async getClasseById(req, res) {
    try {
      const classe = await ClasseService.getClasseById(req.params.id);
      res.json({ success: true, data: classe });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  // Créer une nouvelle classe
  async createClasse(req, res) {
    try {
      const newClasse = await ClasseService.createClasse(req.body);
      res.status(201).json({ success: true, data: newClasse });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mettre à jour une classe
  async updateClasse(req, res) {
    try {
      const updatedClasse = await ClasseService.updateClasse(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: updatedClasse });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Supprimer une classe
  async deleteClasse(req, res) {
    try {
      const result = await ClasseService.deleteClasse(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = ClasseController;
