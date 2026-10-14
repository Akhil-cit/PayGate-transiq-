import api from './axiosInstance';

const transactionService = {
  getAll: (params) => api.get('/transactions', { params }),

  getById: (id) => api.get(`/transactions/${id}`),

  create: (data) => api.post('/transactions', data),

  cancel: (id) => api.patch(`/transactions/${id}/cancel`),

  retry: (id) => api.patch(`/transactions/${id}/retry`),

  validate: (data) => api.post('/transactions/validate', data),
};

export default transactionService;
