import api from './axiosInstance';

const BASE = '/recipients';

const recipientService = {
  getAll:           (params) => api.get(BASE, { params }),
  getById:          (id)     => api.get(`${BASE}/${id}`),
  create:           (data)   => api.post(BASE, data),
  update:           (id, data) => api.put(`${BASE}/${id}`, data),
  remove:           (id)     => api.delete(`${BASE}/${id}`),
  toggleFavourite:  (id)     => api.patch(`${BASE}/${id}/favourite`),
};

export default recipientService;
