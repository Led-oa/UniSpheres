const { query } = require("../config/database");

const CourseModel = {
  async create({ title, content, duration, credits, teach_by, class_id }) {
    const sql = `
        INSERT INTO course (title, content, duration, credits, teach_by, class_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
    const values = [title, content, duration, credits, teach_by, class_id];
    console.log("Values : ", values);
    const result = await query(sql, values);
    return { id_course: result.insertId, ...values };
  },
  async findAll() {
    const sql = `
      SELECT
        c.*,
        u.name       AS teacher_name,
        u.lastname   AS teacher_lastname,
        u.email      AS teacher_email,
        cl.name      AS class_name,
        f.name       AS filiere_name,
        p.name       AS parcours_name,
        y.year_value AS year_value,
        f2.id_file,
        f2.file_name,
        f2.file_path
      FROM course c
      JOIN user u     ON c.teach_by = u.id_user
      JOIN classe cl  ON c.class_id = cl.id_class
      JOIN filiere f  ON cl.filiere_id = f.id_filiere
      JOIN parcours p ON cl.parcours_id = p.id_parcours
      JOIN year y     ON cl.year_id = y.id_year
      LEFT JOIN file f2 ON f2.course_id = c.id_course
      ORDER BY c.id_course
    `;
    return query(sql);
  },
  async findById(courseId) {
    const sql = `
      SELECT
        c.*,
        u.name       AS teacher_name,
        u.lastname   AS teacher_lastname,
        u.email      AS teacher_email,
        cl.name      AS class_name,
        f.name       AS filiere_name,
        p.name       AS parcours_name,
        y.year_value AS year_value,
        f2.id_file,
        f2.file_name,
        f2.file_path,
        f2.created_at
      FROM course c
      JOIN user u     ON c.teach_by = u.id_user
      JOIN classe cl  ON c.class_id = cl.id_class
      JOIN filiere f  ON cl.filiere_id = f.id_filiere
      JOIN parcours p ON cl.parcours_id = p.id_parcours
      JOIN year y     ON cl.year_id = y.id_year
      LEFT JOIN file f2 ON f2.course_id = c.id_course
      WHERE c.id_course = ?
      ORDER BY f2.id_file
    `;
    return query(sql, [courseId]);
  },
  async findByTeacher(teacherId) {
    const sql = `SELECT 
        c.*,
        u_teacher.name as teacher_name,
        u_teacher.lastname as teacher_lastname,
        u_teacher.email as teacher_email,
        cl.name as class_name,
        f.name as filiere_name,
        p.name as parcours_name,
        y.year_value,
        COUNT(DISTINCT f_course.id_file) as total_files,
        COUNT(DISTINCT n.id_note) as total_notes
    FROM course c
    JOIN user u_teacher ON c.teach_by = u_teacher.id_user
    JOIN classe cl ON c.class_id = cl.id_class
    JOIN filiere f ON cl.filiere_id = f.id_filiere
    JOIN parcours p ON cl.parcours_id = p.id_parcours
    JOIN year y ON cl.year_id = y.id_year
    LEFT JOIN file f_course ON f_course.course_id = c.id_course
    LEFT JOIN note n ON n.course_id = c.id_course
    WHERE c.teach_by = ?
    GROUP BY c.id_course
    ORDER BY c.created_at DESC`;

    return query(sql, [teacherId]);
  },
  async findByClass(classId) {
    const sql = `
    SELECT 
      co.*,
      cl.name AS class_name,
      f.name AS filiere_name,
      p.name AS parcours_name,
      y.year_value AS year_name,
      u.id_user AS teacher_id,
      u.name AS teacher_name,
      u.lastname AS teacher_lastname,
      u.email AS teacher_email
    FROM course AS co
    INNER JOIN classe   AS cl ON co.class_id  = cl.id_class
    INNER JOIN filiere  AS f  ON cl.filiere_id  = f.id_filiere
    INNER JOIN parcours AS p  ON cl.parcours_id = p.id_parcours
    INNER JOIN year     AS y  ON cl.year_id     = y.id_year
    INNER JOIN user     AS u  ON co.teach_by    = u.id_user
    WHERE co.class_id = ?
    ORDER BY co.title;
  `;
    return query(sql, [classId]);
  },
  async update(courseId, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    if (!fields.length) return this.findById(courseId);

    const sql = `
      UPDATE course
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id_course = ?
    `;
    values.push(courseId);
    await query(sql, values);
    return this.findById(courseId);
  },
  async delete(courseId) {
    const sql = `DELETE FROM course WHERE id_course = ?`;
    const result = await query(sql, [courseId]);
    return result.affectedRows > 0;
  },
};

module.exports = CourseModel;
