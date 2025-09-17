const express = require("express");

const { authenticateJWT } = require("../middlewares/auth.middleware");
const MessageController = require("../controllers/message.controller");
const {
  messageUpload,
  handleMulterError,
} = require("../middlewares/upload.middleware");

const router = express.Router();

router.use(authenticateJWT);

router.post(
  "/",
  messageUpload.single("file"), // 'file' est le nom du champ dans le FormData
  handleMulterError, // Gestion propre des erreurs Multer
  MessageController.create
);

// Modifier un message
router.patch("/:messageId", MessageController.update);

// Récupérer tous les messages d'une conversation
router.get(
  "/conversation/:conversationId",
  MessageController.getByConversation
);

// Supprimer un message
router.delete("/:messageId", MessageController.remove);

module.exports = router;
