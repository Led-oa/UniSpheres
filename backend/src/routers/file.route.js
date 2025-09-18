const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("../middlewares/auth.middleware");
const {
  courseUpload,
  messageUpload,
  annoncesUpload,
  handleMulterError,
} = require("../middlewares/upload.middleware");

const FileController = require("../controllers/file.controller");

// Toutes les routes nécessitent l'authentification
router.use(authenticateJWT);

router.post(
  "/course",
  courseUpload.array("file", 10), // "file" = nom du champ dans FormData
  handleMulterError,
  FileController.uploadFile
);

router.post(
  "/annonce",
  annoncesUpload.array("file", 10),
  handleMulterError,
  FileController.uploadFile
);

router.post(
  "/message",
  messageUpload.array("file", 10),
  handleMulterError,
  FileController.uploadFile
);

router.put("/:id", FileController.update);

router.delete("/:id", FileController.remove);
router.get("/:ownerType/:ownerId", FileController.fetchByOwner);

module.exports = router;
