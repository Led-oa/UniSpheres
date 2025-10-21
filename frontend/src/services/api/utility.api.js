import api from "../Connect.backend.js";

export const getTablesCount = async () => {
  try {
    const response = await api.get("/utility/tables-count");
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getLastAnnonces = async (limit = 5) => {
  try {
    const response = await api.get(`/utility/last-annonces?limit=${limit}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getCoursesCountInClass = async (classId) => {
  try {
    const response = await api.get(`/utility/class/${classId}/courses-count`);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getCoursesCountByTeacher = async (teacherId) => {
  try {
    const response = await api.get(
      `/utility/teacher/${teacherId}/courses-count`
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getClassesCountByTeacher = async (teacherId) => {
  try {
    const response = await api.get(
      `/utility/teacher/${teacherId}/classes-count`
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
