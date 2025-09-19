const express = require("express");
const router = express.Router();

const NoteController = require("../controllers/note.controller");

const { authenticateJWT } = require("../middlewares/auth.middleware");

router.use(authenticateJWT);

// Insert or update a single note
router.post("/", NoteController.upsertOne);
// Get all notes for a course
router.get("/course/:courseId", NoteController.getByCourse);
// Get note of a specific student in a specific course
router.get(
  "/course/:courseId/student/:studentId",
  NoteController.getForStudent
);
// Get all notes of a specific student
router.get("/student/:studentId", NoteController.getByStudent);
// Get all notes of a course for a class
router.get(
  "/course/:courseId/class/:classId",
  NoteController.getByCourseAndClass
);
// Update a note by its id
router.put("/:noteId", NoteController.update);
// Delete a note by its id
router.delete("/:noteId", NoteController.remove);
// Bulk insert/update
router.post("/bulk", NoteController.bulkUpsert);

module.exports = router;
