const { query } = require("../config/database");

class InfoGenerique {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Récupérer tous les enregistrements
  async getAll() {
    try {
      const sql = `SELECT * FROM \`${this.tableName}\``;
      const rows = await query(sql);
      return rows;
    } catch (error) {
      console.error(`Error in getAll(${this.tableName}):`, error);
      throw new Error("DATABASE_ERROR");
    }
  }

  // Récupérer un enregistrement par son ID
  async getById(idField, idValue) {
    try {
      const sql = `SELECT * FROM \`${this.tableName}\` WHERE \`${idField}\` = ?`;
      const [rows] = await query(sql, [idValue]);
      return rows[0] || null;
    } catch (error) {
      console.error(`Error in getById(${this.tableName}):`, error);
      throw new Error("DATABASE_ERROR");
    }
  }

  // Créer un nouvel enregistrement
  async create(data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => "?").join(", ");
      const sql = `INSERT INTO \`${this.tableName}\` (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;
      const result = await query(sql, values);
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error(`Error in create(${this.tableName}):`, error);
      throw new Error("DATABASE_ERROR");
    }
  }

  // Mettre à jour un enregistrement par ID
  async update(idField, idValue, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setString = keys.map((key) => `\`${key}\` = ?`).join(", ");
      const sql = `UPDATE \`${this.tableName}\` SET ${setString} WHERE \`${idField}\` = ?`;
      await query(sql, [...values, idValue]);
      return { [idField]: idValue, ...data };
    } catch (error) {
      console.error(`Error in update(${this.tableName}):`, error);
      throw new Error("DATABASE_ERROR");
    }
  }

  // Supprimer un enregistrement par ID
  async delete(idField, idValue) {
    try {
      const sql = `DELETE FROM \`${this.tableName}\` WHERE \`${idField}\` = ?`;
      await query(sql, [idValue]);
      return { success: true };
    } catch (error) {
      console.error(`Error in delete(${this.tableName}):`, error);
      throw new Error("DATABASE_ERROR");
    }
  }
}

module.exports = InfoGenerique;
