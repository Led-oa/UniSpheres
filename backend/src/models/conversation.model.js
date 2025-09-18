const { pool, query } = require("../config/database");

const ConversationModel = {
  async privateConversationExists(userId, memberId) {
    const rows = await query(
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

    console.log("Type of rows : ", typeof rows);

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

  async getConversationById(conversationId, userId) {
    try {
      const query = `
        SELECT
            c.*,
            COUNT(DISTINCT cm.member_id) AS member_count,
            EXISTS(
            SELECT
                1
            FROM
                conversation_member
            WHERE
                conversation_id = c.id_conversation AND member_id = ?
        ) AS is_member,
        CASE WHEN c.type = 'private' THEN(
            SELECT
                u.name
            FROM
                conversation_member cm2
            JOIN user u ON
                cm2.member_id = u.id_user
            WHERE
                cm2.conversation_id = c.id_conversation AND cm2.member_id != ?
            LIMIT 1
        ) ELSE NULL
        END AS display_name
        FROM
            conversation c
        LEFT JOIN conversation_member cm ON
            c.id_conversation = cm.conversation_id
        WHERE
            c.id_conversation = ?
        GROUP BY
            c.id_conversation
      `;

      const result = await pool.query(query, [userId, userId, conversationId]);

      // console.log("resultat get convo by id : ", result[0]);

      return result[0] || null;
    } catch (err) {
      console.error("ConversationModel.getConversationById error:", err);
      throw new Error("CONVERSATION_FETCH_FAILED");
    }
  },

  async getConversationMembers(conversationId) {
    try {
      const query = `
      SELECT
        u.id_user,
        u.email,
        u.name,
        u.profile_pic
      FROM
        conversation_member AS cm
      JOIN user AS u
        ON cm.member_id = u.id_user
      WHERE
        cm.conversation_id = ?
      `;

      const [rows] = await pool.query(query, [conversationId]);
      return rows;
    } catch (err) {
      console.error("ConversationModel.getConversationMembers error:", err);
      throw new Error("MEMBERS_FETCH_FAILED");
    }
  },

  async createConversation(title, type) {
    const result = await query(
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
    if (!Array.isArray(memberIds) || memberIds.length === 0) return;
    const values = memberIds.map((id) => [conversationId, id]);

    console.log("Values : ", values);

    const sql =
      "INSERT INTO conversation_member (conversation_id, member_id) VALUES ?";
    return pool.query(sql, [values]); // fonctionnerait si query() utilise pool.query
  },

  async isMember(conversationId, memberId) {
    const rows = await query(
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
