const CourseService = require("../services/course.service");
const FileService = require("../services/file.service");

const CourseController = {
  async createCourse(req, res) {
    try {
      // 1️⃣ Créer le cours
      const courseData = req.body;
      const newCourse = await CourseService.createCourse(courseData);

      // 2️⃣ Vérifier s'il y a des fichiers attachés
      // Supposons que req.files contienne les fichiers uploadés via multer
      if (req.files && req.files.length > 0) {
        const filesData = req.files.map((file) => ({
          file_name: file.originalname,
          file_path: file.path,
          annonce_id: null,
          course_id: newCourse.id_course,
          message_id: null,
        }));

        // 3️⃣ Insérer chaque fichier
        const savedFiles = [];
        for (const fileData of filesData) {
          const savedFile = await FileService.create(fileData);
          savedFiles.push(savedFile);
        }

        // Ajouter les fichiers au retour
        newCourse.files = savedFiles;
      }

      res.status(201).json(newCourse);
    } catch (err) {
      console.error("Error creating course:", err);
      res.status(500).json({ error: "Failed to create course" });
    }
  },
  async getAllCourse(req, res) {
    try {
      const courses = await CourseService.getAll();
      res.json(courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  },
  async getCourseById(req, res) {
    try {
      const courseId = req.params.id;
      const course = await CourseService.getById(courseId);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (err) {
      console.error("Error fetching course:", err);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  },
  async getCourseByTeacher(req, res) {
    try {
      const teacherId = req.params.id;
      
      console.log("teacher id : ", teacherId);

      const courses = await CourseService.getByTeacher(teacherId);
      res.json(courses);
    } catch (err) {
      console.error("Error fetching courses by teacher:", err);
      res.status(500).json({ error: "Failed to fetch courses by teacher" });
    }
  },
  async getCourseByClass(req, res) {
    try {
      const classId = req.params.id;
      const courses = await CourseService.getByClass(classId);
      res.json(courses);
    } catch (err) {
      console.error("Error fetching courses by class:", err);
      res.status(500).json({ error: "Failed to fetch courses by class" });
    }
  },
  async updateCourse(req, res) {
    try {
      const courseId = req.params.id;
      const data = req.body;
      const updatedCourse = await CourseService.updateCourse(courseId, data);
      res.json(updatedCourse);
    } catch (err) {
      console.error("Error updating course:", err);
      res.status(500).json({ error: "Failed to update course" });
    }
  },
  async deleteCourse(req, res) {
    try {
      const courseId = req.params.id;
      const deleted = await CourseService.deleteCourse(courseId);
      if (!deleted) return res.status(404).json({ error: "Course not found" });
      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      console.error("Error deleting course:", err);
      res.status(500).json({ error: "Failed to delete course" });
    }
  },
};

module.exports = CourseController;
