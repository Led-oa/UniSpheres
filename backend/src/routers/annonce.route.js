const express = require("express");
const router = express.Router();

const AnnonceController = require("../controllers/annonce.controller");

const { authenticateJWT } = require("../middlewares/auth.middleware");
const {
  annoncesUpload,
  handleMulterError,
} = require("../middlewares/upload.middleware");

router.use(authenticateJWT);

// Créer une annonce avec fichiers
router.post(
  "/",
  annoncesUpload.array("files", 5), // 'files' correspond au nom du champ multipart/form-data
  handleMulterError,
  AnnonceController.create
);
// Récupérer toutes les annonces
router.get("/", AnnonceController.getAll);
// Récupérer une annonce par ID
router.get("/:id", AnnonceController.getById);
// Mettre à jour une annonce (avec ajout/suppression de fichiers)
router.patch(
  "/:id",
  annoncesUpload.array("files", 5),
  handleMulterError,
  AnnonceController.update
);
// Supprimer une annonce
router.delete("/:id", AnnonceController.delete);

module.exports = router;
