const express = require("express");
const { authenticateJWT } = require("../middlewares/auth.middleware");
const ConversationController = require("../controllers/conversation.controller");

const router = express.Router();

router.use(authenticateJWT);

router.get("/", ConversationController.list);
router.get("/:conversationId", ConversationController.getById);
router.post("/", ConversationController.create);
router.patch("/:conversationId", ConversationController.rename);
router.post("/:conversationId/members", ConversationController.addMember);
router.delete(
  "/:conversationId/members/:memberId",
  ConversationController.removeMember
);
router.patch("/:conversationId/leave", ConversationController.leave);

module.exports = router;
