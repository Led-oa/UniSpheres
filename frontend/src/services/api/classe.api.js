import api from "../Connect.backend";

export const ClasseService = {
  getAll: () => api.get("/classe").then((res) => res.data),
  getById: (id) => api.get(`/classe/${id}`).then((res) => res.data),
  getByTeacher: () => api.get("/classe/enseignant").then((res) => res.data),
  getStudentsFromClass: (id) =>
    api.get(`/classe/${id}/students`).then((res) => res.data),
  create: (data) => api.post("/classe", data).then((res) => res.data),
  update: (id, data) =>
    api.patch(`/classe/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/classe/${id}`).then((res) => res.data),
};
