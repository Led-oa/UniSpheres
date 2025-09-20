const AnnonceModel = require("../models/annonce.model");
const FilePathToUrl = require("../utils/urlCleaner.utils");

const AnnonceService = {
  async createAnnonce(data) {
    // Ici, tu peux ajouter des validations ou transformation des données
    if (!data.title || !data.content || !data.posted_by) {
      throw new Error("Title, content et posted_by sont obligatoires");
    }

    console.log("Service annonce : data from controller : ", data);

    const id = await AnnonceModel.create(data);

    console.log("Service annonce : Id from DB : ", id);

    let annonce = await AnnonceModel.fetchById(id);

    // nettoyer les file_path
    if (annonce.files && annonce.files.length) {
      annonce.files = annonce.files.map((file) => ({
        ...file,
        file_path: FilePathToUrl.urlCleaner(file.file_path),
      }));
    }

    console.log("Service Annonce after create : ", annonce);

    return annonce;
  },

  async getAllAnnonces() {
    const annonces = await AnnonceModel.fetchAll();
    annonces.forEach((annonce) => {
      if (annonce.files && annonce.files.length) {
        annonce.files = annonce.files.map((file) => ({
          ...file,
          file_path: FilePathToUrl.urlCleaner(file.file_path),
        }));
      }
    });

    console.log("Service Annonces : ", annonces);

    return annonces;
  },

  async getAnnonceById(id) {
    const annonce = await AnnonceModel.fetchById(id);
    if (!annonce) {
      throw new Error(`Annonce avec ID ${id} non trouvée`);
    }

    // nettoyer les file_path
    if (annonce.files && annonce.files.length) {
      annonce.files = annonce.files.map((file) => ({
        ...file,
        file_path: FilePathToUrl.urlCleaner(file.file_path),
      }));
    }

    console.log("Service Annonce get by id : ", annonce);

    return annonce;
  },

  async updateAnnonce(id, data) {
    const existingAnnonce = await AnnonceModel.fetchById(id);
    if (!existingAnnonce) {
      throw new Error(`Annonce avec ID ${id} non trouvée`);
    }

    console.log("Service update data : ", data);

    await AnnonceModel.update(id, data);
    let updatedAnnonce = await AnnonceModel.fetchById(id);

    console.log("After update : ", updatedAnnonce);

    // nettoyer les file_path
    if (updatedAnnonce.files && updatedAnnonce.files.length) {
      updatedAnnonce.files = updatedAnnonce.files.map((file) => ({
        ...file,
        file_path: FilePathToUrl.urlCleaner(file.file_path),
      }));
    }

    return updatedAnnonce;
  },

  async deleteAnnonce(id) {
    const existingAnnonce = await AnnonceModel.fetchById(id);
    if (!existingAnnonce) {
      throw new Error(`Annonce avec ID ${id} non trouvée`);
    }
    return await AnnonceModel.delete(id);
  },
};

module.exports = AnnonceService;
