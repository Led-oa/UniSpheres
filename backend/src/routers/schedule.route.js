const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

router.post("/", authenticateJWT, scheduleController.addSchedule);
router.get(
  "/class/:classId",
  authenticateJWT,
  scheduleController.getScheduleOfClasse
);
router.get(
  "/teacher/:teacherId",
  authenticateJWT,
  scheduleController.getScheduleOfTeacher
);
router.get(
  "/class/:classId/current",
  authenticateJWT,
  scheduleController.getCurrentWeekSchedule
);
router.get("/weeks", authenticateJWT, scheduleController.getAvailableWeeks);
router.put("/:scheduleId", authenticateJWT, scheduleController.updateSchedule);
router.delete(
  "/:scheduleId",
  authenticateJWT,
  scheduleController.deleteSchedule
);

module.exports = router;
