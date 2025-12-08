import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/stock/category";
const api = createApiInstance(API_URL);

const categoryApi = {
  getAll: () => api.get(`/getAll`).then(r => r.data),
  getById: (id) => api.get(`/getCategoryById/${id}`).then(r => r.data),
  create: (data) => api.post(`/create`, data).then(r => r.data),
  update: (data) => api.put(`/update`, data).then(r => r.data),
  remove: (id) => api.delete(`/deleteCategoryById/${id}`),
};

export default categoryApi;
