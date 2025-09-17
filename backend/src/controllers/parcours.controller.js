// Fichier : /src/controllers/Parcours.controller.js
const ParcoursService = require("../services/parcours.service");

const ParcoursController = {
  async getAll(req, res) {
    try {
      const data = await ParcoursService.getAll();
      console.log("Controller parcours: ", data);

      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id = req.params.id;
      const data = await ParcoursService.getById(id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const newParcours = await ParcoursService.create(req.body);
      res.status(201).json({ success: true, data: newParcours });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = req.body;
      console.log("controller update parcours: data", data);

      const id = req.params.id;
      const updated = await ParcoursService.update(id, data);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      await ParcoursService.delete(id);
      res.json({ success: true, message: "Supprimé avec succès" });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },
};

module.exports = ParcoursController;
