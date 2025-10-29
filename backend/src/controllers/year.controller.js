// Fichier : /src/controllers/Year.controller.js
const YearService = require("../services/year.service");

const YearController = {
  async getAll(req, res) {
    try {
      const data = await YearService.getAll();
      //   console.log("Controller year: ", data);

      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id = req.params.id;
      const data = await YearService.getById(id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      //   console.log("controller year: data", data);
      const newYear = await YearService.create(data);
      res.status(201).json({ success: true, data: newYear });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const updated = await YearService.update(id, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      console.log("DELETE Year : ", id);
      await YearService.delete(id);
      res.json({ success: true, message: "Supprimé avec succès" });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },
};

module.exports = YearController;
