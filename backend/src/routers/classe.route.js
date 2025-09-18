const express = require("express");
const router = express.Router();
const ClasseController = require("../controllers/classe.controller");

const { authenticateJWT } = require("../middlewares/auth.middleware");

router.use(authenticateJWT);

// Routes CRUD pour les classes
router.get("/", ClasseController.getAllClasses); // Récupérer toutes les classes
router.get("/:id", ClasseController.getClasseById); // Récupérer une classe par ID
router.post("/", ClasseController.createClasse); // Créer une nouvelle classe
router.patch("/:id", ClasseController.updateClasse); // Mettre à jour une classe
router.delete("/:id", ClasseController.deleteClasse); // Supprimer une classe

module.exports = router;
