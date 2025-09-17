const express = require("express");
const router = express.Router();
const YearController = require("../controllers/year.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

router.use(authenticateJWT);

router.get("/", YearController.getAll);
router.get("/:id", YearController.getById);
router.post("/", YearController.create);
router.put("/:id", YearController.update);
router.delete("/:id", YearController.delete);

module.exports = router;
