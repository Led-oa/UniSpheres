const express = require("express");
const router = express.Router();
const ParcoursController = require("../controllers/parcours.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

router.use(authenticateJWT);

router.get("/", ParcoursController.getAll);
router.get("/:id", ParcoursController.getById);
router.post("/", ParcoursController.create);
router.put("/:id", ParcoursController.update);
router.delete("/:id", ParcoursController.delete);

module.exports = router;
