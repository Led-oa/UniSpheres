const FiliereService = require("../services/filiere.service");

const FiliereController = {
  async getAll(req, res) {
    try {
      const data = await FiliereService.getAll();
      //   console.log("Controller filiere: ", data);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id = req.params.id;
      const data = await FiliereService.getById(id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const newFiliere = await FiliereService.create(req.body);
      res.status(201).json({ success: true, data: newFiliere });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const updated = await FiliereService.update(id, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;

      console.log("DELETE filière : ", id);

      await FiliereService.delete(id);
      res.json({ success: true, message: "Supprimé avec succès" });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },
};

module.exports = FiliereController;
