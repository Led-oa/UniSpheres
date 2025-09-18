const ClasseModel = require("../models/classe.model");
const FilePathToUrl = require("../utils/urlCleaner.utils");

const ClasseService = {
  // Récupérer toutes les classes
  async getAllClasses() {
    try {
      const classes = await ClasseModel.getAll();
      return classes;
    } catch (error) {
      console.error("ClasseService.getAllClasses error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  // Récupérer une classe par ID
  async getClasseById(id) {
    try {
      const classe = await ClasseModel.getById(id);
      if (!classe) throw new Error("Classe non trouvée");

      console.log("Service classe : ", classe);

      return classe;
    } catch (error) {
      console.error("ClasseService.getClasseById error:", error);
      throw error;
    }
  },

  async getClasseByTeacher(teacherId) {
    try {
      console.log("Service classe teacher id : ", teacherId);

      const classes = await ClasseModel.getByTeacher(teacherId);

      console.log("Service classe : ", classes);
      return classes;
    } catch (error) {
      console.error("ClasseService.getClasseByTeacher error : ", error);
    }
  },

  async getStudentFromClass(classId) {
    try {
      console.log("Service classe teacher id : ", classId);

      const students = await ClasseModel.getStudentByClass(classId);

      // On ne nettoie que le champ profile_pic
      for (const student of students) {
        if (student.profile_pic) {
          student.profile_pic = FilePathToUrl.urlCleaner(student.profile_pic);
        }
      }

      console.log("Service classe (cleaned profile_pic only): ", students);
      return students;
    } catch (error) {
      console.error("ClasseService.getStudentsFromClass error : ", error);
    }
  },

  // Créer une nouvelle classe
  async createClasse(data) {
    try {
      const newClasse = await ClasseModel.create(data);
      return newClasse;
    } catch (error) {
      console.error("ClasseService.createClasse error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  // Mettre à jour une classe
  async updateClasse(id, data) {
    try {
      const updatedClasse = await ClasseModel.update(id, data);
      return updatedClasse;
    } catch (error) {
      console.error("ClasseService.updateClasse error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  // Supprimer une classe
  async deleteClasse(id) {
    try {
      const result = await ClasseModel.delete(id);
      return result;
    } catch (error) {
      console.error("ClasseService.deleteClasse error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
};

module.exports = ClasseService;
