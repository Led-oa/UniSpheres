import api from "../Connect.backend";

export const AnnonceService = {
  // Récupérer toutes les annonces
  async getAllAnnonces() {
    const response = await api.get("/annonce");
    return response.data.data; // selon le format de ton controller { success, data }
  },

  // Récupérer une annonce par ID
  async getAnnonceById(id) {
    const response = await api.get(`/annonce/${id}`);
    return response.data.data;
  },

  // Créer une annonce avec fichiers
  async createAnnonce(data, files = []) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("posted_by", data.posted_by);
    if (data.target_class_id)
      formData.append("target_class_id", data.target_class_id);
    if (data.target_filiere_id)
      formData.append("target_filiere_id", data.target_filiere_id);
    if (data.target_year_id)
      formData.append("target_year_id", data.target_year_id);
    if (data.type) formData.append("type", data.type);
    if (data.is_visible !== undefined)
      formData.append("is_visible", data.is_visible);
    if (data.priority) formData.append("priority", data.priority);
    if (data.deadline) formData.append("deadline", data.deadline);

    // Ajouter les fichiers
    files.forEach((file) => {
      formData.append("files", file); // 'files' correspond au champ multer
    });

    const response = await api.post("/annonce", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  // Mettre à jour une annonce (ajout/suppression fichiers)
  async updateAnnonce(id, data, files = [], removeFiles = []) {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.target_class_id)
      formData.append("target_class_id", data.target_class_id);
    if (data.target_filiere_id)
      formData.append("target_filiere_id", data.target_filiere_id);
    if (data.target_year_id)
      formData.append("target_year_id", data.target_year_id);
    if (data.type) formData.append("type", data.type);
    if (data.is_visible !== undefined)
      formData.append("is_visible", data.is_visible);
    if (data.priority) formData.append("priority", data.priority);
    if (data.deadline) formData.append("deadline", data.deadline);

    // Ajouter de nouveaux fichiers
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Fichiers à supprimer (tableau d'IDs)
    if (removeFiles.length) {
      formData.append("removeFiles", JSON.stringify(removeFiles));
    }

    const response = await api.patch(`/annonce/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  // Supprimer une annonce
  async deleteAnnonce(id) {
    const response = await api.delete(`/annonce/${id}`);
    return response.data;
  },
};
