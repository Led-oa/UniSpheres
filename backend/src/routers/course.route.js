const express = require("express");
const router = express.Router();
const CourseController = require("../controllers/course.controller");

const { authenticateJWT } = require("../middlewares/auth.middleware");
const {
  courseUpload,
  handleMulterError,
} = require("../middlewares/upload.middleware");

router.use(authenticateJWT);

router.get("/", CourseController.getAllCourse);
router.get("/:id", CourseController.getCourseById);
router.get("/teacher/:id", CourseController.getCourseByTeacher);
router.get("/class/:id", CourseController.getCourseByClass);
router.post(
  "/",
  courseUpload.array("files", 10),
  handleMulterError,
  CourseController.createCourse
);
router.patch("/:id", CourseController.updateCourse);
router.delete("/:id", CourseController.deleteCourse);
module.exports = router;
