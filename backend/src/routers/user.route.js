const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");
const {
  profileUpload,
  handleMulterError,
} = require("../middlewares/upload.middleware");

// Public routes
router.post(
  "/register",
  profileUpload.single("profile_pic"),
  handleMulterError,
  userController.register
);
router.post("/login", userController.login);

router.get("/me", authenticateJWT, userController.me);

// Protected routes
router.get("/", authenticateJWT, userController.getAllUsers);
router.get("/role/:role", authenticateJWT, userController.getUsersByRole);
router.get("/teachers", authenticateJWT, userController.getAllTeachers);
router.get("/:id", authenticateJWT, userController.getUser);
router.patch(
  "/:id",
  profileUpload.single("profile_pic"),
  handleMulterError,
  authenticateJWT,
  userController.updateUser
);
router.patch("/:id/activate", authenticateJWT, userController.activateUser);
router.patch(
  "/:id/desactivate",
  authenticateJWT,
  userController.desactivateUser
);
router.delete("/:id", authenticateJWT, userController.deleteUser);

module.exports = router;
