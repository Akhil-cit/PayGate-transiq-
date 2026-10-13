import api from './axiosInstance';

const analyticsService = {
  getSummary:  ()       => api.get('/analytics/summary'),
  getByMethod: ()       => api.get('/analytics/by-method'),
  getByMonth:  ()       => api.get('/analytics/by-month'),
  getInsights: ()       => api.get('/analytics/insights'),
  exportCsv:   ()       => api.get('/analytics/export', { responseType: 'blob' }),
};

export default analyticsService;
