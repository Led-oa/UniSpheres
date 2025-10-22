const utilityModel = require("../models/utility.model");

const utilityService = {
  // 1. Compter les données dans chaque table
  async getTablesCount() {
    try {
      const result = await utilityModel.countAllTables();
      return result;
    } catch (error) {
      throw new Error("Erreur lors du comptage des données : " + error.message);
    }
  },

  // 2. Récupérer les dernières annonces
  async getLastAnnonces(limit = 5) {
    try {
      const annonces = await utilityModel.getLastAnnonces(limit);
      return annonces;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération des annonces : " + error.message
      );
    }
  },

  // 3. Nombre de cours dans une classe
  async getCoursesCountInClass(classId) {
    if (!classId) throw new Error("L'identifiant de la classe est requis");
    try {
      const count = await utilityModel.countCoursesInClass(classId);
      return count;
    } catch (error) {
      throw new Error(
        "Erreur lors du comptage des cours de la classe : " + error.message
      );
    }
  },

  // 4. Nombre de cours d’un enseignant
  async getCoursesCountByTeacher(teacherId) {
    if (!teacherId) throw new Error("L'identifiant de l'enseignant est requis");
    try {
      const count = await utilityModel.countCoursesByTeacher(teacherId);
      console.log("Count teacher course : ", count);
      return count;
    } catch (error) {
      throw new Error(
        "Erreur lors du comptage des cours de l'enseignant : " + error.message
      );
    }
  },

  // 5. Nombre de classes d’un enseignant
  async getClassesCountByTeacher(teacherId) {
    if (!teacherId) throw new Error("L'identifiant de l'enseignant est requis");
    try {
      const count = await utilityModel.countClassesByTeacher(teacherId);
      console.log("Count teacher classe : ", count);
      return count;
    } catch (error) {
      throw new Error(
        "Erreur lors du comptage des classes de l'enseignant : " + error.message
      );
    }
  },
};

module.exports = utilityService;
