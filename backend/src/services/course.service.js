const CourseModel = require("../models/course.model");
const FilePathToUrl = require("../utils/urlCleaner.utils");

const CourseService = {
  async createCourse(data) {
    // data doit contenir : { title, content, duration, teach_by, class_id }
    return CourseModel.create(data);
  },
  async getAll() {
    // Récupère tous les cours avec fichiers et informations associées
    const rows = await CourseModel.findAll();

    // Regrouper les fichiers par course
    const coursesMap = new Map();
    for (const row of rows) {
      const courseId = row.id_course;
      if (!coursesMap.has(courseId)) {
        coursesMap.set(courseId, {
          id_course: row.id_course,
          title: row.title,
          content: row.content,
          duration: row.duration,
          teach_by: row.teach_by,
          class_id: row.class_id,
          teacher_name: row.teacher_name,
          teacher_lastname: row.teacher_lastname,
          teacher_email: row.teacher_email,
          class_name: row.class_name,
          filiere_name: row.filiere_name,
          parcours_name: row.parcours_name,
          year_value: row.year_value,
          files: [],
        });
      }
      if (row.id_file) {
        coursesMap.get(courseId).files.push({
          id_file: row.id_file,
          file_name: row.file_name,
          file_path: FilePathToUrl.urlCleaner(row.file_path),
        });
      }
    }

    return Array.from(coursesMap.values());
  },
  async getById(courseId) {
    const rows = await CourseModel.findById(courseId);

    if (!rows.length) return null;

    // Même regroupement que pour getAll
    const course = {
      id_course: rows[0].id_course,
      title: rows[0].title,
      content: rows[0].content,
      duration: rows[0].duration,
      teach_by: rows[0].teach_by,
      class_id: rows[0].class_id,
      teacher_name: rows[0].teacher_name,
      teacher_lastname: rows[0].teacher_lastname,
      teacher_email: rows[0].teacher_email,
      class_name: rows[0].class_name,
      filiere_name: rows[0].filiere_name,
      parcours_name: rows[0].parcours_name,
      year_value: rows[0].year_value,
      files: [],
    };

    for (const row of rows) {
      if (row.id_file) {
        course.files.push({
          id_file: row.id_file,
          file_name: row.file_name,
          file_path: FilePathToUrl.urlCleaner(row.file_path),
        });
      }
    }

    console.log("Course service : ", course);

    return course;
  },
  async getByTeacher(teacherId) {
    const res = await CourseModel.findByTeacher(teacherId);
    return res;
  },
  async getByClass(classId) {
    const res = await CourseModel.findByClass(classId);
    return res;
  },
  async updateCourse(courseId, data) {
    return CourseModel.update(courseId, data);
  },
  async deleteCourse(courseId) {
    return CourseModel.delete(courseId);
  },
};

module.exports = CourseService;
