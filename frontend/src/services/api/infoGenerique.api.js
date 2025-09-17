import api from "../Connect.backend"; // notre instance Axios

export const FiliereService = {
  getAll: () => api.get("/filiere").then((res) => res.data),
  getById: (id) => api.get(`/filiere/${id}`).then((res) => res.data),
  create: (data) => api.post("/filiere", data).then((res) => res.data),
  update: (id, data) => api.put(`/filiere/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/filiere/${id}`).then((res) => res.data),
};

export const ParcoursService = {
  getAll: () => api.get("/parcours").then((res) => res.data),
  getById: (id) => api.get(`/parcours/${id}`).then((res) => res.data),
  create: (data) => api.post("/parcours", data).then((res) => res.data),
  update: (id, data) =>
    api.put(`/parcours/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/parcours/${id}`).then((res) => res.data),
};

export const YearService = {
  getAll: () => api.get("/year").then((res) => res.data),
  getById: (id) => api.get(`/year/${id}`).then((res) => res.data),
  create: (data) => api.post("/year", data).then((res) => res.data),
  update: (id, data) => api.put(`/year/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/year/${id}`).then((res) => res.data),
};
