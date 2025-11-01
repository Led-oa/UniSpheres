const { query } = require("../config/database");

const MessageModel = {
  // Créer/envoyer un message dans une conversation
  async create({ conversationId, senderId, content }) {
    const result = await query(
      "INSERT INTO message (conversation_id, sender_id, content) VALUES (?, ?, ?)",
      [conversationId, senderId, content]
    );
    const rows = await query("SELECT * FROM message WHERE id_message = ?", [
      result.insertId,
    ]);
    return rows[0];
  },

  // Modifier un message
  async update({ messageId, senderId, content }) {
    // Vérifier que l'utilisateur est bien le sender
    const [check] = await query(
      "SELECT * FROM message WHERE id_message = ? AND sender_id = ?",
      [messageId, senderId]
    );

    if (!check) {
      console.log("Checking member not pass check : ", check);
      return null;
    }

    console.log("Checking member pass check: ", check);

    await query("UPDATE message SET content = ? WHERE id_message = ?", [
      content,
      messageId,
    ]);
    const rows = await query("SELECT * FROM message WHERE id_message = ?", [
      messageId,
    ]);
    return rows[0];
  },

  // Récupérer tous les messages d'une conversation
  async getByConversation(conversationId, userId) {
    // Verifier que l'user est membre
    const [members] = await query(
      "SELECT * FROM conversation_member WHERE conversation_id = ? AND member_id = ?",
      [conversationId, userId]
    );

    if (members.length === 0) {
      return res
        .status(403)
        .json({ error: "Access denied to this conversation" });
    }

    const rows = await query(
      `SELECT 
    m.id_message, 
    m.conversation_id, 
    m.sender_id, 
    m.content, 
    m.created_at, 
    m.updated_at,
    u.name, 
    u.lastname, 
    u.profile_pic,
    u.role,
    f.file_name, 
    f.file_path,
    c.title as conversation_title,
    c.type as conversation_type
FROM message m
JOIN user u ON m.sender_id = u.id_user
JOIN conversation c ON m.conversation_id = c.id_conversation
LEFT JOIN file f ON f.message_id = m.id_message
WHERE m.conversation_id = ?
ORDER BY m.created_at ASC`,
      [conversationId]
    );

    return rows;
  },

  async getMessageById(messageId) {
    const sql = `
      SELECT m.*, f.file_path, f.file_name, u.name as sender_name
      FROM message m
      LEFT JOIN file f ON m.id_message = f.message_id
      LEFT JOIN user u ON m.sender_id = u.id_user
      WHERE m.id_message = ?
    `;

    const [rows] = await query(sql, [messageId]);
    return rows[0] || null;
  },

  // Supprimer un message
  async delete({ messageId, senderId }) {
    // Vérifier que l'utilisateur est bien le sender
    const [check] = await query(
      "SELECT * FROM message WHERE id_message = ? AND sender_id = ?",
      [messageId, senderId]
    );
    if (!check) return false;

    await query("DELETE FROM message WHERE id_message = ?", [messageId]);
    return true;
  },
};

module.exports = MessageModel;
