import api from './axiosInstance';
const BASE = '/pockets';
export default {
  getAll: () => api.get(BASE),
  create: (data) => api.post(BASE, data),
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  deposit: (id, amount) => api.patch(`${BASE}/${id}/deposit`, { amount }),
  withdraw: (id, amount) => api.patch(`${BASE}/${id}/withdraw`, { amount }),
  toggleLock: (id) => api.patch(`${BASE}/${id}/lock`),
  remove: (id) => api.delete(`${BASE}/${id}`)
};
