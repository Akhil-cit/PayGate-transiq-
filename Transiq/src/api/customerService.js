import api from './axiosInstance';
export default {
  getMe: () => api.get('/customers/me'),
  getDashboard: () => api.get('/customers/me/dashboard'),
  updateMe: (data) => api.put('/customers/me', data)
};
