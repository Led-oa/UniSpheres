const utilityService = require("../services/utility.service");

const utilityController = {
  // 1. Compter les données dans chaque table
  async getTablesCount(req, res) {
    try {
      const data = await utilityService.getTablesCount();
      res.status(200).json({
        success: true,
        message: "Nombre de lignes dans chaque table",
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // 2. Récupérer les dernières annonces
  async getLastAnnonces(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const annonces = await utilityService.getLastAnnonces(limit);
      res.status(200).json({
        success: true,
        message: "Dernières annonces récupérées avec succès",
        data: annonces,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // 3. Nombre de cours dans une classe
  async getCoursesCountInClass(req, res) {
    try {
      const classId = req.params.classId;
      const count = await utilityService.getCoursesCountInClass(classId);
      res.status(200).json({
        success: true,
        message: "Nombre de cours dans la classe",
        classId,
        count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // 4. Nombre de cours d’un enseignant
  async getCoursesCountByTeacher(req, res) {
    try {
      const teacherId = req.params.teacherId;
      const count = await utilityService.getCoursesCountByTeacher(teacherId);
      res.status(200).json({
        success: true,
        message: "Nombre de cours de l'enseignant",
        teacherId,
        count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // 5. Nombre de classes d’un enseignant
  async getClassesCountByTeacher(req, res) {
    try {
      const teacherId = req.params.teacherId;
      const count = await utilityService.getClassesCountByTeacher(teacherId);
      res.status(200).json({
        success: true,
        message: "Nombre de classes où l'enseignant intervient",
        teacherId,
        count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = utilityController;
