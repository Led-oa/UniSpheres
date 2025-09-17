const ConversationService = require("../services/conversation.service");

module.exports = (socket, io) => {
  console.log("🔌 Conversation socket initialized for", socket.id);

  // --- Rejoindre une room personnelle pour recevoir notifications privées ---
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their personal room`);
  });

  // --- Rejoindre une room de conversation ---
  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // --- Quitter une room de conversation ---
  socket.on("leaveConversation", (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });

  // --- Événement : nouvelle conversation créée ---
  socket.on("conversationCreated", (conversation) => {
    const members = conversation.members || [];
    members.forEach((memberId) => {
      io.to(`user_${memberId}`).emit("conversationCreated", conversation);
    });
  });

  // --- Événement : conversation renommée ---
  socket.on("conversationRenamed", ({ conversationId, title }) => {
    io.to(`conversation_${conversationId}`).emit("conversationRenamed", {
      conversationId,
      title,
    });
  });

  // --- Événement : ajouter un membre à une conversation ---
  socket.on("addedToConversation", ({ conversationId, memberId }) => {
    io.to(`user_${memberId}`).emit("addedToConversation", { conversationId });
  });

  // --- Événement : retirer un membre d'une conversation ---
  socket.on("removedFromConversation", ({ conversationId, memberId }) => {
    io.to(`user_${memberId}`).emit("removedFromConversation", {
      conversationId,
    });
    io.to(`conversation_${conversationId}`).emit("memberRemoved", { memberId });
  });

  // --- Événement : quitter une conversation ---
  socket.on("leftConversation", ({ conversationId, userId }) => {
    io.to(`conversation_${conversationId}`).emit("leftConversation", {
      conversationId,
      userId,
    });
  });

  // --- Événement : suppression de la conversation (optionnel) ---
  socket.on("conversationDeleted", ({ conversationId, members }) => {
    if (!members || !members.length) return;
    members.forEach((memberId) => {
      io.to(`user_${memberId}`).emit("conversationDeleted", { conversationId });
    });
    io.to(`conversation_${conversationId}`).emit("conversationDeleted", {
      conversationId,
    });
  });
};
