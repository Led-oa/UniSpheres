const { query } = require("../config/database");

const AnnonceModel = {
  async create(data) {
    const sql = `
    INSERT INTO annonce
      (title, content, posted_by, target_class_id, target_filiere_id, target_year_id, type, is_visible, priority, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    console.log("Model Annonce : data from services : ", data);

    const params = [
      data.title,
      data.content,
      data.posted_by,
      data.target_class_id || null,
      data.target_filiere_id || null,
      data.target_year_id || null,
      data.type || "general",
      data.is_visible !== undefined ? data.is_visible : 1,
      data.priority || "medium",
      data.deadline || null,
    ];

    const result = await query(sql, params);

    console.log("Model : Annonce id res :", result.insertId);

    return result.insertId;
  },

  async fetchAll(limit, offset) {
    const sql = `
      SELECT 
        a.*,
        u.name       AS posted_by_name,
        u.lastname   AS posted_by_lastname,
        u.email      AS posted_by_email,
        u.profile_pic,
        c.name       AS class_name,
        f.name       AS filiere_name,
        y.year_value AS year_value,
        f2.id_file,
        f2.file_name,
        f2.file_path
      FROM annonce a
      JOIN user u       ON a.posted_by = u.id_user
      LEFT JOIN classe c ON a.target_class_id = c.id_class
      LEFT JOIN filiere f ON a.target_filiere_id = f.id_filiere
      LEFT JOIN year y   ON a.target_year_id = y.id_year
      LEFT JOIN file f2  ON f2.annonce_id = a.id_annonce
      WHERE a.is_visible = 1
      ORDER BY a.created_at DESC, f2.id_file LIMIT ? OFFSET ?
    `;
    console.log("MODEL Annonce : limit : ", limit);
    console.log("MODEL Annonce : offset : ", offset);
    const rows = await query(sql, [limit, offset]);

    const countSql = `
    SELECT COUNT(*) as totalCount 
    FROM annonce a 
    WHERE a.is_visible = 1
  `;

    const countResult = await query(countSql);
    const totalCount = countResult[0].totalCount;

    // console.log("Annonce model total count : ", totalCount);

    // Regrouper les fichiers par annonce
    const map = new Map();
    for (const row of rows) {
      const id = row.id_annonce;
      if (!map.has(id)) {
        map.set(id, {
          ...row,
          files: [],
        });
      }
      if (row.id_file) {
        map.get(id).files.push({
          id_file: row.id_file,
          file_name: row.file_name,
          file_path: row.file_path,
        });
      }
      // supprimer les colonnes individuelles pour ne garder que files
      delete map.get(id).id_file;
      delete map.get(id).file_name;
      delete map.get(id).file_path;
    }

    return {
      annonces: Array.from(map.values()),
      totalCount,
    };
  },

  async fetchById(id) {
    const sql = `
    SELECT 
      a.*,
      u.name       AS posted_by_name,
      u.lastname   AS posted_by_lastname,
      u.email      AS posted_by_email,
      u.profile_pic,
      c.name       AS class_name,
      f.name       AS filiere_name,
      y.year_value AS year_value,
      f2.id_file,
      f2.file_name,
      f2.file_path
    FROM annonce a
    JOIN user u       ON a.posted_by = u.id_user
    LEFT JOIN classe c ON a.target_class_id = c.id_class
    LEFT JOIN filiere f ON a.target_filiere_id = f.id_filiere
    LEFT JOIN year y   ON a.target_year_id = y.id_year
    LEFT JOIN file f2  ON f2.annonce_id = a.id_annonce
    WHERE a.id_annonce = ?
    ORDER BY f2.id_file
  `;
    const rows = await query(sql, [id]);

    console.log("Model : rows fetchBy Id :", rows);

    if (!rows.length) return null;

    const annonce = { ...rows[0], files: [] };
    for (const row of rows) {
      if (row.id_file) {
        annonce.files.push({
          id_file: row.id_file,
          file_name: row.file_name,
          file_path: row.file_path,
        });
      }
    }
    delete annonce.id_file;
    delete annonce.file_name;
    delete annonce.file_path;

    return annonce;
  },

  async update(id, data) {
    const sql = `
    UPDATE annonce SET
      title = ?,
      content = ?,
      target_class_id = ?,
      target_filiere_id = ?,
      target_year_id = ?,
      type = ?,
      is_visible = ?,
      priority = ?,
      deadline = ?
    WHERE id_annonce = ?
  `;
    const params = [
      data.title,
      data.content,
      data.target_class_id || null,
      data.target_filiere_id || null,
      data.target_year_id || null,
      data.type || "general",
      data.is_visible !== undefined ? data.is_visible : 1,
      data.priority || "medium",
      data.deadline || null,
      id,
    ];
    return await query(sql, params);
  },

  async delete(id) {
    const sql = `DELETE FROM annonce WHERE id_annonce = ?`;
    return await query(sql, [id]);
  },
};

module.exports = AnnonceModel;
