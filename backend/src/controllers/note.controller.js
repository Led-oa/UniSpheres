const NoteService = require("../services/note.service");

const NoteController = {
  async upsertOne(req, res) {
    try {
      const noteData = req.body;
      const result = await NoteService.upsertOne(noteData);
      res.status(200).json({
        success: true,
        message: "Note inserted/updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async bulkUpsert(req, res) {
    try {
      const notes = req.body.notes;
      const result = await NoteService.bulkUpsert(notes);
      res.status(200).json({
        success: true,
        message: "Notes inserted/updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getForStudent(req, res) {
    try {
      const { courseId, studentId } = req.params;
      const result = await NoteService.getForStudent(courseId, studentId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getByCourse(req, res) {
    try {
      const { courseId } = req.params;
      const result = await NoteService.getByCourse(courseId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getByStudent(req, res) {
    try {
      const { studentId } = req.params;
      const result = await NoteService.getByStudent(studentId);
      console.log("Note de l'etudiant : ", result);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getByCourseAndClass(req, res) {
    try {
      const { courseId, classId } = req.params;
      const result = await NoteService.getByCourseAndClass(courseId, classId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { noteId } = req.params;
      const noteData = req.body;
      const result = await NoteService.update(noteId, noteData);
      res.status(200).json({
        success: true,
        message: "Note updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async remove(req, res) {
    try {
      const { noteId } = req.params;
      const result = await NoteService.remove(noteId);
      res.status(200).json({
        success: true,
        message: "Note deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

module.exports = NoteController;
