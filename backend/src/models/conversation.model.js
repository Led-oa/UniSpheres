const { query } = require("../config/database");

const ConversationModel = {
  async privateConversationExists(userId, memberId) {
    const [rows] = await query(
      `SELECT c.id_conversation
             FROM conversation c
             JOIN conversation_member cm1 ON cm1.conversation_id = c.id_conversation
             JOIN conversation_member cm2 ON cm2.conversation_id = c.id_conversation
             WHERE c.type = 'private'
               AND cm1.member_id = ?
               AND cm2.member_id = ?
             LIMIT 1`,
      [userId, memberId]
    );
    return rows.length ? rows[0].id_conversation : null;
  },

  async getUserConversations(userId) {
    const rows = await query(
      `SELECT 
        c.id_conversation, 
        c.title, 
        c.type, 
        c.created_at,
        (SELECT content FROM message m WHERE m.conversation_id = c.id_conversation ORDER BY created_at DESC LIMIT 1) AS last_message,
        CASE 
          WHEN c.type = 'private' THEN (
            SELECT CONCAT(u.name, ' ', u.lastname) 
            FROM user u 
            JOIN conversation_member cm ON u.id_user = cm.member_id 
            WHERE cm.conversation_id = c.id_conversation AND cm.member_id != ?
            LIMIT 1
          )
          ELSE c.title
        END AS display_name
       FROM conversation c
       JOIN conversation_member cm ON cm.conversation_id = c.id_conversation
       WHERE cm.member_id = ?`,
      [userId, userId]
    );

    console.log("[Model Convo list] rows :: ", rows);

    return rows;
  },

  async createConversation(title, type) {
    const [result] = await query(
      "INSERT INTO conversation (title, type) VALUES (?, ?)",
      [title || null, type]
    );
    return result.insertId;
  },

  async addMember(conversationId, memberId) {
    await query(
      "INSERT INTO conversation_member (conversation_id, member_id) VALUES (?, ?)",
      [conversationId, memberId]
    );
  },

  async addMembersBulk(conversationId, memberIds) {
    if (!memberIds.length) return;
    const values = memberIds.map((id) => [conversationId, id]);
    await query(
      "INSERT INTO conversation_member (conversation_id, member_id) VALUES ?",
      [values]
    );
  },

  async isMember(conversationId, memberId) {
    const [rows] = await query(
      "SELECT 1 FROM conversation_member WHERE conversation_id = ? AND member_id = ?",
      [conversationId, memberId]
    );
    return rows.length > 0;
  },

  async renameConversation(conversationId, title) {
    await query("UPDATE conversation SET title = ? WHERE id_conversation = ?", [
      title,
      conversationId,
    ]);
  },

  async removeMember(conversationId, memberId) {
    await query(
      "DELETE FROM conversation_member WHERE conversation_id = ? AND member_id = ?",
      [conversationId, memberId]
    );
  },
};

module.exports = ConversationModel;
