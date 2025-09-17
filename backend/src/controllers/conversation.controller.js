const ConversationService = require("../services/conversation.service");
const { getIO } = require("../socket/index.socket");

const ConversationController = {
  async list(req, res) {
    try {
      const data = await ConversationService.listForUser(req.user.id_user);

      console.log("[Controller] list convo data : ", data);

      res.json({ conversations: data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  },
  async create(req, res) {
    const { title, type, memberIds } = req.body;
    if (!type || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    try {
      console.log("Controller Conversation create title: ", title);
      console.log("Controller Conversation create type: ", type);
      console.log("Controller Conversation create memberIds: ", memberIds);

      const result = await ConversationService.create({
        creatorId: req.user.id_user,
        title,
        type,
        memberIds,
      });

      if (result.duplicateId) {
        return res.status(400).json({
          error: "Private conversation already exists",
          conversationId: result.duplicateId,
        });
      }

      const newConversation = {
        id_conversation: result,
        title: title || null,
        type,
        members: [req.user.id_user, ...memberIds],
        created_at: new Date(),
      };

      try {
        const io = getIO();
        for (const memberId of newConversation.members) {
          io.to(`user_${memberId}`).emit(
            "conversationCreated",
            newConversation
          );
        }
      } catch (err) {
        console.error("Socket.IO not initialized:", err);
      }

      res.status(201).json(newConversation);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  },
  async rename(req, res) {
    try {
      await ConversationService.rename({
        conversationId: req.params.conversationId,
        userId: req.user.id_user,
        title: req.body.title,
      });

      try {
        const io = getIO();
        io.to(`conversation_${req.params.conversationId}`).emit(
          "conversationRenamed",
          {
            conversationId: req.params.conversationId,
            title: req.body.title,
          }
        );
      } catch (err) {
        console.error("Socket.IO not initialized:", err);
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      if (err.message === "FORBIDDEN")
        return res.status(403).json({ error: "Access denied" });
      res.status(500).json({ error: "Failed to rename conversation" });
    }
  },

  async addMember(req, res) {
    try {
      await ConversationService.addMember({
        conversationId: req.params.conversationId,
        requesterId: req.user.id_user,
        memberId: req.body.memberId,
      });

      try {
        const io = getIO();
        io.to(`user_${req.body.memberId}`).emit("addedToConversation", {
          conversationId: req.params.conversationId,
        });
      } catch (err) {
        console.error("Socket.IO not initialized:", err);
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      if (err.message === "FORBIDDEN")
        return res.status(403).json({ error: "Access denied" });
      if (err.message === "ALREADY_MEMBER")
        return res
          .status(400)
          .json({ error: "Member already in conversation" });
      res.status(500).json({ error: "Failed to add member" });
    }
  },

  async removeMember(req, res) {
    try {
      await ConversationService.removeMember({
        conversationId: req.params.conversationId,
        requesterId: req.user.id_user,
        memberId: req.params.memberId,
      });

      try {
        const io = getIO();
        io.to(`user_${req.params.memberId}`).emit("removedFromConversation", {
          conversationId: req.params.conversationId,
        });
      } catch (err) {
        console.error("Socket.IO not initialized:", err);
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      if (err.message === "FORBIDDEN")
        return res.status(403).json({ error: "Access denied" });
      res.status(500).json({ error: "Failed to remove member" });
    }
  },

  async leave(req, res) {
    try {
      await ConversationService.leave({
        conversationId: req.params.conversationId,
        userId: req.user.id_user,
      });

      try {
        const io = getIO();
        io.to(`user_${req.user.id_user}`).emit("leftConversation", {
          conversationId: req.params.conversationId,
        });
      } catch (err) {
        console.error("Socket.IO not initialized:", err);
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to leave conversation" });
    }
  },
};

module.exports = ConversationController;
