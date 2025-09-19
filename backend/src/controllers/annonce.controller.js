const AnnonceService = require("../services/annonce.service");
const FileService = require("../services/file.service");

const AnnonceController = {
  async create(req, res) {
    try {
      const data = req.body;
      const files = req.files || []; // supposons que les fichiers sont envoyés via multipart/form-data

      // Créer l'annonce
      const annonce = await AnnonceService.createAnnonce(data);

      // Créer les fichiers associés
      if (files.length) {
        for (const file of files) {
          await FileService.create({
            file_name: file.originalname,
            file_path: file.path,
            annonce_id: annonce.id_annonce,
          });
        }
        // Recharger l'annonce avec les fichiers
        const updatedAnnonce = await AnnonceService.getAnnonceById(
          annonce.id_annonce
        );
        return res.status(201).json({ success: true, data: updatedAnnonce });
      }

      res.status(201).json({ success: true, data: annonce });
    } catch (err) {
      console.error("AnnonceController.create error:", err);
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const annonces = await AnnonceService.getAllAnnonces();
      res.status(200).json({ success: true, data: annonces });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const annonce = await AnnonceService.getAnnonceById(id);
      res.status(200).json({ success: true, data: annonce });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = req.body;
      const files = req.files || []; // fichiers envoyés à ajouter
      const removeFiles = req.body.removeFiles || []; // tableau d'IDs de fichiers à supprimer

      // Mettre à jour l'annonce
      const updatedAnnonce = await AnnonceService.updateAnnonce(id, data);

      // Supprimer les fichiers si demandé
      if (removeFiles.length) {
        for (const fileId of removeFiles) {
          await FileService.remove(fileId);
        }
      }

      // Ajouter de nouveaux fichiers
      if (files.length) {
        for (const file of files) {
          await FileService.create({
            file_name: file.originalname,
            file_path: file.path,
            annonce_id: updatedAnnonce.id_annonce,
          });
        }
      }

      // Recharger l'annonce avec tous les fichiers
      const finalAnnonce = await AnnonceService.getAnnonceById(
        updatedAnnonce.id_annonce
      );
      res.status(200).json({ success: true, data: finalAnnonce });
    } catch (err) {
      console.error("AnnonceController.update error:", err);
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      await AnnonceService.deleteAnnonce(id);
      res
        .status(200)
        .json({ success: true, message: "Annonce supprimée avec succès" });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },
};

module.exports = AnnonceController;
