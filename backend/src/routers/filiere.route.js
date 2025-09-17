const express = require("express");
const router = express.Router();
const FiliereController = require("../controllers/filiere.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

router.use(authenticateJWT);

router.get("/", FiliereController.getAll);
router.get("/:id", FiliereController.getById);
router.post("/", FiliereController.create);
router.put("/:id", FiliereController.update);
router.delete("/:id", FiliereController.delete);

module.exports = router;
