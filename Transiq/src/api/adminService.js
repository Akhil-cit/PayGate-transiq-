import api from './axiosInstance';

const adminService = {
  getStats: () =>
    api.get('/admin/stats'),

  getHealth: () =>
    api.get('/health'),

  getTransactions: (params = {}) =>
    api.get('/admin/transactions', { params }),

  getTransactionById: (id) =>
    api.get(`/admin/transactions/${id}`),

  forceSuccess: (id) =>
    api.patch(`/admin/transactions/${id}/force-success`),

  forceFail: (id, failureReason = 'BANK_TIMEOUT') =>
    api.patch(`/admin/transactions/${id}/force-fail`, { failureReason }),

  getErrors: (params = {}) =>
    api.get('/admin/errors', { params }),

  resolveError: (id, resolutionNotes = '') =>
    api.patch(`/admin/errors/${id}/resolve`, { resolutionNotes }),

  resolveAllErrors: (resolutionNotes = '') =>
    api.post('/admin/errors/resolve-all', { resolutionNotes }),

  getUsers: (params = {}) =>
    api.get('/admin/users', { params }),

  freezeWallet: (userId) =>
    api.patch(`/admin/users/${userId}/freeze`),

  toggleUserActive: (userId) =>
    api.patch(`/admin/users/${userId}/activate`),
};

export default adminService;
