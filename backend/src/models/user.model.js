const { query } = require("../config/database");

const userModel = {
  async create(userData) {
    try {
      const sql = `
          INSERT INTO user (matricule, name, lastname, email, profile_pic, password_hash, role, is_active, class_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      const values = [
        userData.matricule || null,
        userData.name,
        userData.lastname,
        userData.email,
        userData.profile_pic || null,
        userData.password_hash,
        userData.role,
        userData.is_active,
        userData.class_id || null,
      ];
      const result = await query(sql, values);
      return { id_user: result.insertId, ...userData };
    } catch (error) {
      console.error("UserModel.create error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  async findByEmail(userEmail) {
    try {
      const sql = `SELECT * FROM user WHERE email = ? LIMIT 1`;
      const rows = await query(sql, [userEmail]);
      return rows[0] || null;
    } catch (error) {
      console.error("UserModel.findByEmail error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  async findById(userId, join = true) {
    try {
      let sql;
      if (join) {
        sql = `
            SELECT u.*, c.name AS class_name, f.name AS filiere_name, p.name AS parcours_name, y.year_value
            FROM user u
            LEFT JOIN classe c ON u.class_id = c.id_class
            LEFT JOIN filiere f ON c.filiere_id = f.id_filiere
            LEFT JOIN parcours p ON c.parcours_id = p.id_parcours
            LEFT JOIN year y ON c.year_id = y.id_year
            WHERE u.id_user = ?
            LIMIT 1
          `;
      } else {
        sql = `SELECT * FROM user WHERE id_user = ? LIMIT 1`;
      }
      const rows = await query(sql, [userId]);
      return rows[0] || null;
    } catch (error) {
      console.error("UserModel.findById error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  async findByMatricule(userMatricule, join = true) {
    try {
      let sql;
      if (join) {
        sql = `
            SELECT u.*, c.name AS class_name, f.name AS filiere_name, p.name AS parcours_name, y.year_value
            FROM user u
            LEFT JOIN classe c ON u.class_id = c.id_class
            LEFT JOIN filiere f ON c.filiere_id = f.id_filiere
            LEFT JOIN parcours p ON c.parcours_id = p.id_parcours
            LEFT JOIN year y ON c.year_id = y.id_year
            WHERE u.matricule = ?
            LIMIT 1
          `;
      } else {
        sql = `SELECT * FROM user WHERE matricule = ? LIMIT 1`;
      }
      const rows = await query(sql, [userMatricule]);
      return rows[0] || null;
    } catch (error) {
      console.error("UserModel.findByMatricule error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  async getTotalCount() {
    try {
      const sql = `SELECT COUNT(*) as total FROM user`;
      const rows = await query(sql);
      return rows[0].total;
    } catch (error) {
      console.error("UserModel.getTotalCount error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  async getCountByRole(role) {
    try {
      const sql = `SELECT COUNT(*) as total FROM user WHERE role = ?`;
      const rows = await query(sql, [role]);
      return rows[0].total;
    } catch (error) {
      console.error("UserModel.getCountByRole error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  async findAll(limit, offset, join = true) {
    try {
      let sql;
      if (join) {
        sql = `
            SELECT u.*, c.name AS class_name, f.name AS filiere_name, p.name AS parcours_name, y.year_value
            FROM user u
            LEFT JOIN classe c ON u.class_id = c.id_class
            LEFT JOIN filiere f ON c.filiere_id = f.id_filiere
            LEFT JOIN parcours p ON c.parcours_id = p.id_parcours
            LEFT JOIN year y ON c.year_id = y.id_year
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
          `;
      } else {
        sql = `SELECT * FROM user ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      }
      return await query(sql, [limit, offset]);
    } catch (error) {
      console.error("UserModel.findAll error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  async findAllByRole(limit, offset, userRole, join = true) {
    try {
      let sql;
      if (join) {
        sql = `
            SELECT u.*, c.name AS class_name, f.name AS filiere_name, p.name AS parcours_name, y.year_value
            FROM user u
            LEFT JOIN classe c ON u.class_id = c.id_class
            LEFT JOIN filiere f ON c.filiere_id = f.id_filiere
            LEFT JOIN parcours p ON c.parcours_id = p.id_parcours
            LEFT JOIN year y ON c.year_id = y.id_year
            WHERE u.role = ?
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
          `;
      } else {
        sql = `SELECT * FROM user WHERE role = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      }
      return await query(sql, [userRole, limit, offset]);
    } catch (error) {
      console.error("UserModel.findAllByRole error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  async findAllTeacher(join = true) {
    try {
      let sql;
      if (join) {
        sql = `
            SELECT u.*, c.name AS class_name, f.name AS filiere_name, p.name AS parcours_name, y.year_value
            FROM user u
            LEFT JOIN classe c ON u.class_id = c.id_class
            LEFT JOIN filiere f ON c.filiere_id = f.id_filiere
            LEFT JOIN parcours p ON c.parcours_id = p.id_parcours
            LEFT JOIN year y ON c.year_id = y.id_year
            WHERE u.role = "teacher"
            ORDER BY u.created_at DESC
          `;
      } else {
        sql = `SELECT * FROM user WHERE role = "teacher" ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      }
      return await query(sql);
    } catch (error) {
      console.error("UserModel.findAllByRole error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  async loadAll() {
    try {
      const sql = `
            SELECT u.*, c.name AS class_name, f.name AS filiere_name, p.name AS parcours_name, y.year_value
            FROM user u
            LEFT JOIN classe c ON u.class_id = c.id_class
            LEFT JOIN filiere f ON c.filiere_id = f.id_filiere
            LEFT JOIN parcours p ON c.parcours_id = p.id_parcours
            LEFT JOIN year y ON c.year_id = y.id_year
            WHERE u.role = "teacher" OR u.role = "student"
            ORDER BY u.created_at DESC
          `;
      const row = await query(sql);
      console.log("ROW : ", row);
      return row;
    } catch (error) {
      console.error("UserModel.findAllByRole error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  async update(userData) {
    try {
      const { id_user, ...safeUpdates } = userData;

      const setClauses = [];
      const params = [];
      for (const [key, value] of Object.entries(safeUpdates)) {
        setClauses.push(`${key} = ?`);
        params.push(value);
      }

      if (setClauses.length === 0) {
        throw new Error("NO_VALID_FIELDS_TO_UPDATE");
      }

      params.push(id_user);
      const sql = `UPDATE user SET ${setClauses.join(", ")} WHERE id_user = ?`;
      const result = await query(sql, params);

      return result.affectedRows > 0;
    } catch (error) {
      console.error("UserModel.update error:", error);
      if (error.message === "NO_VALID_FIELDS_TO_UPDATE") {
        throw error;
      }
      throw new Error("DATABASE_ERROR");
    }
  },

  async desactivate(userId) {
    try {
      const sql = `UPDATE user SET is_active = 0 WHERE id_user = ?`;
      const result = await query(sql, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("UserModel.desactivate error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  async activate(userId) {
    try {
      const sql = `UPDATE user SET is_active = 1 WHERE id_user = ?`;
      const result = await query(sql, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("UserModel.activate error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  async hardDelete(userId) {
    try {
      const sql = `DELETE FROM user WHERE id_user = ?`;
      const result = await query(sql, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("UserModel.hardDelete error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
};

module.exports = userModel;
