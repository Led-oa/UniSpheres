const { query } = require("../config/database");

const FileModel = {
  async create({
    file_name,
    file_path,
    annonce_id = null,
    course_id = null,
    message_id = null,
  }) {
    const sql = `
          INSERT INTO file (file_name, file_path, annonce_id, course_id, message_id)
          VALUES (?, ?, ?, ?, ?)
        `;
    const values = [file_name, file_path, annonce_id, course_id, message_id];
    const result = await query(sql, values);
    return { id_file: result.insertId, ...values };
  },

  async update(id_file, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    if (fields.length === 0) return this.findById(id_file);

    const sql = `UPDATE file SET ${fields.join(
      ", "
    )}, updated_at = CURRENT_TIMESTAMP WHERE id_file = ?`;
    values.push(id_file);
    await query(sql, values);
    return this.findById(id_file);
  },

  async remove(id_file) {
    const sql = `DELETE FROM file WHERE id_file = ?`;
    const [result] = await query(sql, [id_file]);
    return result.affectedRows > 0;
  },
};

module.exports = FileModel;
