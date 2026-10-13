import api from './axiosInstance';

const transactionService = {
  // List with filters
  getAll: (params) => api.get('/transactions', { params }),

  // Single detail
  getById: (id) => api.get(`/transactions/${id}`),

  // Initiate new transfer
  create: (data) => api.post('/transactions', data),

  // Cancel pending
  cancel: (id) => api.patch(`/transactions/${id}/cancel`),

  // Retry failed
  retry: (id) => api.patch(`/transactions/${id}/retry`),

  // Pre-flight validation
  validate: (data) => api.post('/transactions/validate', data),
};

export default transactionService;
