import api from "../Connect.backend"; // l'instance Axios que tu as déjà créée

const FileAPI = {
  uploadCourseFile: (formData) => {
    return api.post("/file/course", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadAnnonceFile: (formData) => {
    return api.post("/file/annonce", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadMessageFile: (formData) => {
    return api.post("/file/message", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateFile: (fileId, data) => {
    return api.put(`/file/${fileId}`, data);
  },

  removeFile: (fileId) => {
    return api.delete(`/file/${fileId}`);
  },

  fetchFilesByOwner: (ownerType, ownerId) => {
    return api.get(`/file/${ownerType}/${ownerId}`);
  },
};

export default FileAPI;
