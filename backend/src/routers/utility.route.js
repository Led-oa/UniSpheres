const express = require("express");
const router = express.Router();
const utilityController = require("../controllers/utility.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

router.get("/tables-count", authenticateJWT, utilityController.getTablesCount);

router.get(
  "/last-annonces",
  authenticateJWT,
  utilityController.getLastAnnonces
);

router.get(
  "/class/:classId/courses-count",
  authenticateJWT,
  utilityController.getCoursesCountInClass
);

router.get(
  "/teacher/:teacherId/courses-count",
  authenticateJWT,
  utilityController.getCoursesCountByTeacher
);

router.get(
  "/teacher/:teacherId/classes-count",
  authenticateJWT,
  utilityController.getClassesCountByTeacher
);

module.exports = router;
