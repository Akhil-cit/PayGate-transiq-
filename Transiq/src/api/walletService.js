import api from './axiosInstance';
export default {
  getMine: () => api.get('/wallets/me'),
  updateCurrency: (currency) => api.put('/wallets/me/currency', { currency })
};
